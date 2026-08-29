import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ForbiddenException, Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { AWSConfig } from '../../../config/config.type';
import { DishService } from '../../dish/services/dish.service';
import { UserService } from '../../user/services/user.service';

@Global()
@Injectable()
export class S3Service {
  private readonly awsConfig: AWSConfig;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly dishService: DishService,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');
    this.s3Client = this.createS3Client();
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ key: string }> {
    const allowedFolders = ['dishes', 'avatars'];
    if (!allowedFolders.includes(folderName)) {
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
        ACL: 'public-read',
      }),
    );

    return { key };
  }

  async deleteKeysBestEffort(keys: string[]): Promise<void> {
    const dishKeys = keys.filter(
      (key) => key.startsWith('dishes/') || key.startsWith('avatars/'),
    );

    await Promise.allSettled(
      dishKeys.map((key) =>
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.awsConfig.bucketName,
            Key: key,
          }),
        ),
      ),
    );
  }

  async deleteFile(key: string, userId: string): Promise<void> {
    const isAvatar = key.startsWith('avatars/');
    const isDish = key.startsWith('dishes/');

    if (!isAvatar && !isDish) {
      throw new ForbiddenException('Invalid file key');
    }

    let hasOwnership = false;
    const avatarUser = isAvatar
      ? await this.userService.findOne({ image: key })
      : null;

    if (isAvatar) {
      hasOwnership = avatarUser?.id === userId;
    }

    if (isDish) {
      const dishIdMatch = key.match(/^dishes\/([^/]+)\//);
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

    if (avatarUser) {
      await this.userService.update(avatarUser.id, { image: null });
    }
  }

  private createS3Client(): S3Client {
    return new S3Client({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
      endpoint: this.awsConfig.endpoint,
      forcePathStyle: true,
    });
  }
}
