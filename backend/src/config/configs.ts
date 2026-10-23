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
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  jwt: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'access secret',
    accessTokenExpiration:
      parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION, 10) || 3600,
    refreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh secret',
    refreshTokenExpiration:
      parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION, 10) || 86400,
    passwordResetTokenExpiration:
      parseInt(process.env.AUTH_PASSWORD_RESET_TOKEN_EXPIRATION, 10) || 3600,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
    region: process.env.AWS_REGION || 'eu-west-1',
    s3Region:
      process.env.AWS_S3_REGION || process.env.AWS_REGION || 'eu-west-1',
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },
  ses: {
    fromEmail: process.env.SES_FROM_EMAIL || '',
    fromName: process.env.SES_FROM_NAME || 'CookBook',
  },
});
