import { Module } from '@nestjs/common';

import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
