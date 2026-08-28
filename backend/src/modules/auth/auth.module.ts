import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { AuthCookieService } from './services/auth-cookie.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [JwtModule, RedisModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCacheService,
    AuthCookieService,
    TokenService,
    RefreshTokenRepository,
    PasswordResetTokenRepository,
    JwtRefreshGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
  exports: [AuthCacheService, AuthCookieService, AuthService],
})
export class AuthModule {}
