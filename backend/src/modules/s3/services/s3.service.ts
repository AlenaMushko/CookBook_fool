import * as path from 'node:path';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  ForbiddenException,
  forwardRef,
  Global,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { AWSConfig } from '../../../config/config.type';
import { DishService } from '../../dish/services/dish.service';
import { UserService } from '../../user/services/user.service';
import { S3_FOLDERS, S3Folder } from '../constants/s3-folder.enum';

@Global()
@Injectable()
export class S3Service {
  private readonly awsConfig: AWSConfig;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => DishService))
    private readonly dishService: DishService,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');
    this.s3Client = this.createS3Client();
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ key: string }> {
    if (!S3_FOLDERS.includes(folderName as S3Folder)) {
      throw new ForbiddenException('Invalid folder name');
    }

    const randomName = crypto
      .randomBytes(Math.ceil(12))
      .toString('hex')
      .slice(0, 24);
    const fileExtension = path.extname(file.originalname);
    const key = `${folderName}/${randomName}${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsConfig.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { key };
  }

  async getSignedGetUrl(
    key: string,
    expiresInSeconds = 60 * 60,
  ): Promise<string> {
    return await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.awsConfig.bucketName,
        Key: key,
      }),
      { expiresIn: expiresInSeconds },
    );
  }

  async deleteKeysBestEffort(keys: string[]): Promise<void> {
    const mediaKeys = [
      ...new Set(
        keys
          .filter((key): key is string => Boolean(key))
          .map((key) => key.replace(/^\//, ''))
          .filter((key) =>
            S3_FOLDERS.some((folder) => key.startsWith(`${folder}/`)),
          ),
      ),
    ];

    await Promise.all(
      mediaKeys.map(async (key) => {
        try {
          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.awsConfig.bucketName,
              Key: key,
            }),
          );
        } catch (error) {
          // Orphaned objects are preferable to failing the user update.
          console.error(`Failed to delete S3 object: ${key}`, error);
        }
      }),
    );
  }

  async deleteFile(key: string, userId: string): Promise<void> {
    const isAvatar = key.startsWith(`${S3Folder.AVATARS}/`);
    const isRecipe = key.startsWith(`${S3Folder.RECIPES}/`);

    if (!isAvatar && !isRecipe) {
      throw new ForbiddenException('Invalid file key');
    }

    let hasOwnership = false;
    const avatarUser = isAvatar
      ? await this.userService.findOne({ image: key })
      : null;

    if (isAvatar) {
      // Allow deleting pending uploads (not yet linked to a user) or own avatar.
      hasOwnership = !avatarUser || avatarUser.id === userId;
    }

    if (isRecipe) {
      const dishIdMatch = key.match(
        new RegExp(`^${S3Folder.RECIPES}/([^/]+)/`),
      );
      if (dishIdMatch) {
        await this.dishService.findOwnedOrThrow(dishIdMatch[1], userId);
        hasOwnership = true;
      } else {
        hasOwnership = true;
      }
    }

    if (!hasOwnership) {
      throw new ForbiddenException('You do not own this file');
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.awsConfig.bucketName,
        Key: key,
      }),
    );

    if (avatarUser?.id === userId) {
      await this.userService.clearImage(userId);
    }
  }

  private createS3Client(): S3Client {
    return new S3Client({
      region: this.awsConfig.s3Region,
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
    });
  }
}
