import { User } from '@prisma/client';

import { UserResDto } from '../models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: User): UserResDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      image: user.image,
    };
  }
}
