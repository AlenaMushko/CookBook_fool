import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { UpdateUserReqDto } from '../models/dto/req/update-user.req.dto';
import { UserResDto } from '../models/dto/res/user.res.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from './user.mapper';

const defaultUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  image: true,
  created: true,
  updated: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findUserById(id: string): Promise<UserResDto> {
    const user = await this.findOne({ id }, defaultUserSelect);
    if (!user) {
      throw new UnprocessableEntityException();
    }
    return UserMapper.toResDto(user);
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const existing = await this.findOne({ id }, defaultUserSelect);
    if (!existing) {
      throw new UnprocessableEntityException();
    }

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
    const user = await this.findOne({ email });
    if (user) {
      throw new AppException(
        ErrorCode.USER_EMAIL_EXISTS,
        409,
        'Email is already taken',
      );
    }
  }

  public async findOne(
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ): Promise<User | null> {
    return await this.userRepository.findOne(where, select);
  }
}
