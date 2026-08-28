import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import logger from '../../../logger';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { ForgotPasswordRequestDto } from '../dto/request/forgot-password.request.dto';
import { ResetPasswordRequestDto } from '../dto/request/reset-password.request.dto';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../dto/request/sign-up.request.dto';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { PasswordResetTokenRepository } from '../repositories/password-reset-token.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { AuthMapper, AuthSessionWithTokens } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

type AuthSessionResult = AuthSessionWithTokens;

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshRepository: RefreshTokenRepository,
    private readonly passwordResetRepository: PasswordResetTokenRepository,
  ) {}

  public async signUp(dto: SignUpRequestDto): Promise<AuthSessionResult> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password,
    });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshRepository.saveToken(
        user.id,
        dto.deviceId,
        tokens.refreshToken,
      ),
      this.authCacheService.saveToken(
        user.id,
        dto.deviceId,
        tokens.accessToken,
      ),
    ]);

    return AuthMapper.toSessionWithTokens(user, tokens);
  }

  public async signIn(dto: SignInRequestDto): Promise<AuthSessionResult> {
    const userEntity = await this.userRepository.findOne(
      { email: dto.email },
      { id: true, password: true },
    );
    if (!userEntity) {
      throw new AppException(
        ErrorCode.AUTH_INVALID_CREDENTIALS,
        401,
        'Invalid email or password',
      );
    }

    const isPasswordsMatch = await bcrypt.compare(
      dto.password,
      userEntity.password,
    );

    if (!isPasswordsMatch) {
      throw new AppException(
        ErrorCode.AUTH_INVALID_CREDENTIALS,
        401,
        'Invalid email or password',
      );
    }

    const user = await this.userRepository.findOneBy({ id: userEntity.id });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });

    await Promise.all([
      this.refreshRepository.deleteByUserAndDevice(user.id, dto.deviceId),
      this.authCacheService.removeToken(user.id, dto.deviceId),
    ]);

    await Promise.all([
      this.refreshRepository.saveToken(
        user.id,
        dto.deviceId,
        tokens.refreshToken,
      ),
      this.authCacheService.saveToken(
        user.id,
        dto.deviceId,
        tokens.accessToken,
      ),
    ]);

    return AuthMapper.toSessionWithTokens(user, tokens);
  }

  public async logout(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshRepository.deleteByUserAndDevice(
        userData.userId,
        userData.deviceId,
      ),
      this.authCacheService.removeToken(userData.userId, userData.deviceId),
    ]);
  }

  public async forgotPassword(
    dto: ForgotPasswordRequestDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne(
      { email: dto.email },
      { id: true },
    );

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

      await this.passwordResetRepository.deleteByUserId(user.id);
      await this.passwordResetRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      });

      // TODO: send password-reset email with link containing rawToken
      logger.info(
        { email: dto.email, resetToken: rawToken },
        'Password reset token generated',
      );
    }

    return {
      message:
        'If an account with this email exists, reset instructions have been sent.',
    };
  }

  public async resetPassword(dto: ResetPasswordRequestDto): Promise<void> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const resetToken =
      await this.passwordResetRepository.findByTokenHash(tokenHash);

    if (!resetToken) {
      throw new AppException(ErrorCode.AUTH_TOKEN_EXPIRED, 401);
    }

    if (resetToken.expiresAt < new Date()) {
      await this.passwordResetRepository.deleteById(resetToken.id);
      throw new AppException(ErrorCode.AUTH_TOKEN_EXPIRED, 401);
    }

    const password = await bcrypt.hash(dto.password, 10);
    await this.userRepository.save({ id: resetToken.userId }, { password });
    await this.passwordResetRepository.deleteById(resetToken.id);
    await this.invalidateAllSessions(resetToken.userId);
  }

  public async refreshToken(userData: IUserData): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await Promise.all([
      this.refreshRepository.deleteByUserAndDevice(user.id, userData.deviceId),
      this.authCacheService.removeToken(user.id, userData.deviceId),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: userData.deviceId,
    });

    await Promise.all([
      this.refreshRepository.saveToken(
        user.id,
        userData.deviceId,
        tokens.refreshToken,
      ),
      this.authCacheService.saveToken(
        user.id,
        userData.deviceId,
        tokens.accessToken,
      ),
    ]);
    return tokens;
  }

  public async invalidateAllSessions(userId: string): Promise<void> {
    await Promise.all([
      this.refreshRepository.deleteAllByUserId(userId),
      this.authCacheService.invalidateAllUserSessions(userId),
    ]);
  }
}
