import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../user/repositories/user.repository';
import { SKIP_AUTH } from '../constants/constants';
import { OPTIONAL_AUTH } from '../decorators/optional-auth.decorator';
import { TokenType } from '../enums/token-type.enum';
import { AuthCacheService } from '../services/auth-cache.service';
import { AuthCookieService } from '../services/auth-cookie.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private authCookieService: AuthCookieService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    const optionalAuth = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_AUTH,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const accessToken = this.authCookieService.getAccessTokenFromRequest(request);

    if (!accessToken) {
      if (skipAuth || optionalAuth) return true;
      throw new UnauthorizedException();
    }

    if (skipAuth || optionalAuth) {
      try {
        await this.attachUser(request, accessToken);
      } catch {
        // optional — invalid token is ignored
      }
      return true;
    }

    await this.attachUser(request, accessToken);
    return true;
  }

  private async attachUser(
    request: { user?: unknown },
    accessToken: string,
  ): Promise<void> {
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!findTokenInRedis) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = {
      userId: user.id,
      email: user.email,
      deviceId: payload.deviceId,
    };
  }
}
