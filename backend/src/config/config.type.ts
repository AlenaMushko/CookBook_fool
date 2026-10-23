export type Config = {
  app: AppConfig;
  postgres: PostgresConfig;
  jwt: JWTConfig;
  aws: AWSConfig;
  ses: SesConfig;
};

export type AppConfig = {
  port: number;
  host: string;
  nodeEnv: string;
  allowedOrigins: string[];
  frontendUrl: string;
};

export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type JWTConfig = {
  accessTokenSecret: string;
  accessTokenExpiration: number;
  refreshTokenSecret: string;
  refreshTokenExpiration: number;
  passwordResetTokenExpiration: number;
};

export type AWSConfig = {
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
  s3Region: string;
  bucketName: string;
};

export type SesConfig = {
  fromEmail: string;
  fromName: string;
};
