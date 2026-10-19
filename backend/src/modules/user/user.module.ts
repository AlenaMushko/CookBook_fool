import { forwardRef, Module } from '@nestjs/common';

import { S3Module } from '../s3/s3.module';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [forwardRef(() => S3Module)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
