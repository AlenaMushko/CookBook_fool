import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/exceptions/app.exception';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findUserById(id: string): Promise<UserResDto> {
    const user = await this.findByIdOrThrow(id);
    return UserMapper.toResDto(user);
  }

  public async update(
    id: string,
    updateUserDto: Partial<UpdateUserReqDto>,
  ): Promise<UserResDto> {
    await this.findByIdOrThrow(id);

    const updatedUser = await this.userRepository.save(
      { id },
      {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        phone: updateUserDto.phone,
        image: updateUserDto.image,
      },
    );

    return UserMapper.toResDto(updatedUser);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new AppException(
        ErrorCode.USER_EMAIL_EXISTS,
        409,
        'Email is already taken',
      );
    }
  }

  public async findByIdOrThrow(
    id: string,
    includePassword = false,
  ): Promise<User> {
    const user = await this.userRepository.findOne(
      { id },
      {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        ...(includePassword ? { password: true } : {}),
        created: true,
        updated: true,
      },
    );

    if (!user) {
      throw new UnprocessableEntityException();
    }
    return user;
  }

  public async findByImage(image: string): Promise<User | null> {
    return await this.userRepository.findOne({ image });
  }
}
