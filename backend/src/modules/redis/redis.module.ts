import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { Config, RedisConfig } from '../../config/config.type';
import logger from '../../logger';
import { RedisService } from './redis.service';

const redisProvider = {
  provide: 'REDIS_PROVIDER',
  useFactory: (configService: ConfigService<Config>) => {
    const redisConfig = configService.get<RedisConfig>('redis');

    return new Redis({
      host: redisConfig.host || 'localhost',
      port: redisConfig.port || 6379,
      password: redisConfig.password || undefined,
      maxRetriesPerRequest: 3,
    }).on('error', (error: Error) => {
      logger.error({ err: error }, 'Redis connection error');
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
