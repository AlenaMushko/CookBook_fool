import { User } from '@prisma/client';

import { UserMapper } from '../../user/services/user.mapper';
import { AuthSessionResponseDto } from '../dto/response/auth-session.response.dto';
import { TokenResponseDto } from '../dto/response/token.response.dto';

export type AuthSessionWithTokens = AuthSessionResponseDto & {
  tokens: TokenResponseDto;
};

export class AuthMapper {
  public static toSessionResponseDto(userEntity: User): AuthSessionResponseDto {
    return {
      user: UserMapper.toResDto(userEntity),
    };
  }

  public static toSessionWithTokens(
    userEntity: User,
    tokens: TokenResponseDto,
  ): AuthSessionWithTokens {
    return {
      ...AuthMapper.toSessionResponseDto(userEntity),
      tokens,
    };
  }
}
