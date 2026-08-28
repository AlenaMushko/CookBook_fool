import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isExist = await this.refreshRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
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
