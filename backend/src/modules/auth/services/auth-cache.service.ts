import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Config, JWTConfig } from '../../../config/config.type';
import { AccessTokenRepository } from '../repositories/access-token.repository';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JWTConfig;

  constructor(
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt', { infer: true });
  }

  public async saveToken(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<void> {
    const expiresAt = new Date(
      Date.now() + this.jwtConfig.accessTokenExpiration * 1000,
    );
    await this.accessTokenRepository.saveToken(
      userId,
      deviceId,
      accessToken,
      expiresAt,
    );
  }

  public async removeToken(userId: string, deviceId: string): Promise<void> {
    await this.accessTokenRepository.deleteByUserAndDevice(userId, deviceId);
  }

  public async isAccessTokenExist(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<boolean> {
    return await this.accessTokenRepository.isActiveToken(
      userId,
      deviceId,
      accessToken,
    );
  }

  public async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.accessTokenRepository.deleteAllByUserId(userId);
  }
}
