import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AppConfig, Config, JWTConfig } from '../../../config/config.type';
import { AUTH_COOKIE_NAMES } from '../constants/constants';
import { TokenResponseDto } from '../dto/response/token.response.dto';

@Injectable()
export class AuthCookieService {
  private readonly jwtConfig: JWTConfig;
  private readonly secureCookies: boolean;

  constructor(private readonly configService: ConfigService<Config>) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt', { infer: true });

    const isProduction =
      this.configService.get<AppConfig>('app', { infer: true }).nodeEnv ===
      'production';

    const cookieSecure = process.env.COOKIE_SECURE;

    if (
      cookieSecure !== undefined &&
      cookieSecure !== 'true' &&
      cookieSecure !== 'false'
    ) {
      throw new Error('COOKIE_SECURE must be "true" or "false"');
    }

    this.secureCookies =
      cookieSecure === undefined ? isProduction : cookieSecure === 'true';
  }

  public setAuthCookies(res: Response, tokens: TokenResponseDto): void {
    const baseOptions = {
      httpOnly: true,
      secure: this.secureCookies,
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
      ...baseOptions,
      httpOnly: false,
      maxAge: this.jwtConfig.refreshTokenExpiration * 1000,
    });
  }

  public clearAuthCookies(res: Response): void {
    const options = {
      secure: this.secureCookies,
      sameSite: 'strict' as const,
      path: '/',
    };

    res.clearCookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN, options);
    res.clearCookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN, options);
    res.clearCookie(AUTH_COOKIE_NAMES.SESSION, options);
  }

  public getAccessTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[AUTH_COOKIE_NAMES.ACCESS_TOKEN] as string | undefined;
  }

  public getRefreshTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[AUTH_COOKIE_NAMES.REFRESH_TOKEN] as string | undefined;
  }
}
