import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configs';
import { AuthModule } from './auth/auth.module';
import { ConversionModule } from './conversion/conversion.module';
import { DishModule } from './dish/dish.module';
import { HealthModule } from './health/health.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { MeasurementUnitModule } from './measurement-unit/measurement-unit.module';
import { MenuModule } from './menu/menu.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./environments/local.env', './.env', '../.env'],
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    HealthModule,
    RedisModule,
    AuthModule,
    IngredientModule,
    MeasurementUnitModule,
    S3Module,
    DishModule,
    MenuModule,
    ConversionModule,
  ],
})
export class AppModule {}
