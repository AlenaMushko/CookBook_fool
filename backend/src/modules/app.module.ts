import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configs';
import { AuthModule } from './auth/auth.module';
import { DishModule } from './dish/dish.module';
import { HealthModule } from './health/health.module';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        './environments/local.env',
        './environments/prod.env',
      ],
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    HealthModule,
    PostgresModule,
    RepositoryModule,
    RedisModule,
    AuthModule,
    S3Module,
    DishModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
