import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AppConfig, Config, JWTConfig } from '../../../config/config.type';
import { AUTH_COOKIE_NAMES } from '../constants/constants';
import { TokenResponseDto } from '../dto/response/token.response.dto';

@Injectable()
export class AuthCookieService {
  private readonly jwtConfig: JWTConfig;
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService<Config>) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt', { infer: true });
    this.isProduction =
      this.configService.get<AppConfig>('app', { infer: true }).nodeEnv ===
      'production';
  }

  public setAuthCookies(res: Response, tokens: TokenResponseDto): void {
    const baseOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict' as const,
      path: '/',
    };

    res.cookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
      ...baseOptions,
      maxAge: this.jwtConfig.accessTokenExpiration * 1000,
    });

    res.cookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
      ...baseOptions,
      maxAge: this.jwtConfig.refreshTokenExpiration * 1000,
    });

    res.cookie(AUTH_COOKIE_NAMES.SESSION, '1', {
      httpOnly: false,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: this.jwtConfig.refreshTokenExpiration * 1000,
    });
  }

  public clearAuthCookies(res: Response): void {
    res.clearCookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
    res.clearCookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
    res.clearCookie(AUTH_COOKIE_NAMES.SESSION, { path: '/' });
  }

  public getAccessTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[AUTH_COOKIE_NAMES.ACCESS_TOKEN] as string | undefined;
  }

  public getRefreshTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[AUTH_COOKIE_NAMES.REFRESH_TOKEN] as string | undefined;
  }
}
