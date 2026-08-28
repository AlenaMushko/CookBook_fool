import { Config } from './config.type';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:80',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
      : DEFAULT_ALLOWED_ORIGINS,
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'access secret',
    accessTokenExpiration:
      parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION, 10) || 3600,
    refreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh secret',
    refreshTokenExpiration:
      parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION, 10) || 86400,
  },
  aws: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_S3_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    endpoint: process.env.AWS_S3_ENDPOINT,
  },
});
