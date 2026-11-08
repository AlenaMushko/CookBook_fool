import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { UserRepository } from '../../user/repositories/user.repository';
import { TokenType } from '../enums/token-type.enum';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { AuthCookieService } from '../services/auth-cookie.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshRepository: RefreshTokenRepository,
    private authCookieService: AuthCookieService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken =
      this.authCookieService.getRefreshTokenFromRequest(request);

    if (!refreshToken) {
      throw new AppException(
        ErrorCode.AUTH_REQUIRED,
        401,
        'Authentication required',
      );
    }

    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new AppException(
        ErrorCode.AUTH_TOKEN_INVALID,
        401,
        'Invalid token',
      );
    }

    const isActive = await this.refreshRepository.isActiveToken(refreshToken);
    if (!isActive) {
      throw new AppException(
        ErrorCode.AUTH_SESSION_INACTIVE,
        401,
        'Session is no longer active',
      );
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new AppException(
        ErrorCode.AUTH_SESSION_INACTIVE,
        401,
        'Session is no longer active',
      );
    }

    request.user = {
      userId: user.id,
      email: user.email,
      deviceId: payload.deviceId,
      refreshToken,
    };
    return true;
  }
}
