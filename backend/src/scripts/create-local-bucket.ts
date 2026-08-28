import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

import logger from '../logger';

dotenv.config({ path: 'environments/local.env' });

const accessKeyId =
  process.env.AWS_S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey =
  process.env.AWS_S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: process.env.AWS_S3_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: true,
});

async function createBucket() {
  try {
    await client.send(
      new CreateBucketCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
      }),
    );
    logger.info({ bucket: process.env.AWS_S3_BUCKET_NAME }, 'Bucket created');
  } catch {
    logger.info(
      { bucket: process.env.AWS_S3_BUCKET_NAME },
      'Bucket already exists',
    );
  }
}

void createBucket();
