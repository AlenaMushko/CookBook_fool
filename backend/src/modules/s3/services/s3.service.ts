import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { AWSConfig } from '../../../config/config.type';
import { UserService } from '../../user/services/user.service';

@Global()
@Injectable()
export class S3Service {
  private readonly awsConfig: AWSConfig;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');
    this.s3Client = this.createS3Client();
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<{ key: string }> {
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

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.awsConfig.bucketName,
        Key: key,
      }),
    );

    const user = await this.userService.findByImage(key);

    if (user) {
      user.image = null;
      await this.userService.update(user.id, user);
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
