import { Module, forwardRef } from '@nestjs/common';

import { DishModule } from '../dish/dish.module';
import { UserModule } from '../user/user.module';
import { S3Controller } from './s3.controller';
import { S3Service } from './services/s3.service';

@Module({
  controllers: [S3Controller],
  imports: [UserModule, forwardRef(() => DishModule)],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
