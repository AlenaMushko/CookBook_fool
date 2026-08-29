import { User } from '@prisma/client';

import { UserResDto } from '../models/dto/res/user.res.dto';

/** Strips sensitive fields (e.g. password) from a full User entity. */
export class UserMapper {
  public static toResDto(
    user: Pick<
      User,
      'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'image'
    >,
  ): UserResDto {
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
