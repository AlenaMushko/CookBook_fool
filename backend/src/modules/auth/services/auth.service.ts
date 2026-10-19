import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { ErrorCode } from '../../../common/constants/error-codes';
import { AppException } from '../../../common/expections/app.exception';
import { AppConfig, Config, JWTConfig } from '../../../config/config.type';
import logger from '../../../logger';
import { EmailTemplate } from '../../email/constants/email-template.enum';
import { EmailService } from '../../email/email.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { ForgotPasswordRequestDto } from '../dto/request/forgot-password.request.dto';
import { ResetPasswordRequestDto } from '../dto/request/reset-password.request.dto';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../dto/request/sign-up.request.dto';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { ValidateResetTokenResponseDto } from '../dto/response/validate-reset-token.response.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { PasswordResetTokenRepository } from '../repositories/password-reset-token.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { AuthMapper, AuthSessionWithTokens } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

type AuthSessionResult = AuthSessionWithTokens;

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(totalSeconds, 60);

  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }

  return `${seconds} seconds`;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshRepository: RefreshTokenRepository,
    private readonly passwordResetRepository: PasswordResetTokenRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async signUp(dto: SignUpRequestDto): Promise<AuthSessionResult> {
    const email = dto.email.trim().toLowerCase();
    await this.userService.isEmailUniqueOrThrow(email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email,
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
      { email: dto.email.trim().toLowerCase() },
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
    const email = dto.email.trim().toLowerCase();
    const genericResponse = {
      message:
        'If an account with this email exists, reset instructions have been sent.',
    };

    const user = await this.userRepository.findOne(
      { email },
      { id: true, firstName: true, email: true },
    );

    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const resetTokenTtlSeconds = this.getPasswordResetTokenTtlSeconds();
    const expiresAt = new Date(Date.now() + resetTokenTtlSeconds * 1000);
    const resetLink = this.buildPasswordResetLink(rawToken);

    try {
      await this.passwordResetRepository.deleteByUserId(user.id);
      await this.passwordResetRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      await this.emailService.sendTemplate(EmailTemplate.FORGOT_PASSWORD, {
        to: user.email,
        context: {
          firstName: user.firstName,
          resetLink,
          expiresIn: formatDuration(resetTokenTtlSeconds),
        },
      });

      logger.info({ email }, 'Password reset email queued');
    } catch (error) {
      await this.passwordResetRepository
        .deleteByUserId(user.id)
        .catch(() => undefined);
      logger.error(
        { err: error, email },
        'Failed to process password reset request',
      );
    }

    return genericResponse;
  }

  private getPasswordResetTokenTtlSeconds(): number {
    const seconds =
      this.configService.get<JWTConfig>('jwt')?.passwordResetTokenExpiration ??
      3600;

    return Math.max(seconds, 60);
  }

  private buildPasswordResetLink(token: string): string {
    const frontendUrl = (
      this.configService.get<AppConfig>('app')?.frontendUrl ??
      'http://localhost:5173'
    ).replace(/\/$/, '');

    const search = new URLSearchParams({ token });
    return `${frontendUrl}/reset-password?${search.toString()}`;
  }

  public async validateResetToken(
    token: string,
  ): Promise<ValidateResetTokenResponseDto> {
    const resetToken = await this.findPasswordResetToken(token);

    if (!resetToken) {
      return { status: 'invalid' };
    }

    if (resetToken.expiresAt < new Date()) {
      await this.passwordResetRepository.deleteById(resetToken.id);
      return { status: 'expired' };
    }

    return { status: 'valid' };
  }

  public async resetPassword(dto: ResetPasswordRequestDto): Promise<void> {
    const resetToken = await this.findPasswordResetToken(dto.token);

    if (!resetToken) {
      throw new AppException(
        ErrorCode.AUTH_RESET_LINK_INVALID,
        400,
        'Reset link is invalid or has already been used',
      );
    }

    if (resetToken.expiresAt < new Date()) {
      await this.passwordResetRepository.deleteById(resetToken.id);
      throw new AppException(
        ErrorCode.AUTH_TOKEN_EXPIRED,
        401,
        'Reset link has expired',
      );
    }

    const password = await bcrypt.hash(dto.password, 10);
    await this.userRepository.save({ id: resetToken.userId }, { password });
    await this.passwordResetRepository.deleteById(resetToken.id);
    await this.invalidateAllSessions(resetToken.userId);
  }

  private async findPasswordResetToken(rawToken: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    return await this.passwordResetRepository.findByTokenHash(tokenHash);
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
