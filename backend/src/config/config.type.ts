export type Config = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
  aws: AWSConfig;
};

export type AppConfig = {
  port: number;
  host: string;
  nodeEnv: string;
  allowedOrigins: string[];
};

export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};

export type JWTConfig = {
  accessTokenSecret: string;
  accessTokenExpiration: number;
  refreshTokenSecret: string;
  refreshTokenExpiration: number;
};

export type AWSConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  endpoint: string;
};
