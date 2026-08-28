import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AUTH_COOKIE_NAMES } from './constants/constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { ForgotPasswordRequestDto } from './dto/request/forgot-password.request.dto';
import { ResetPasswordRequestDto } from './dto/request/reset-password.request.dto';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';
import { AuthSessionResponseDto } from './dto/response/auth-session.response.dto';
import { RefreshSessionResponseDto } from './dto/response/refresh-session.response.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';
import { AuthCookieService } from './services/auth-cookie.service';

@ApiTags('Auth')
@ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authCookieService: AuthCookieService,
  ) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  public async signUp(
    @Body() dto: SignUpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSessionResponseDto> {
    const session = await this.authService.signUp(dto);
    this.authCookieService.setAuthCookies(res, session.tokens);
    return { user: session.user };
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSessionResponseDto> {
    const session = await this.authService.signIn(dto);
    this.authCookieService.setAuthCookies(res, session.tokens);
    return { user: session.user };
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  public async forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  public async resetPassword(
    @Body() dto: ResetPasswordRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.resetPassword(dto);
    this.authCookieService.clearAuthCookies(res);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(
    @CurrentUser() userData: IUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userData);
    this.authCookieService.clearAuthCookies(res);
  }

  @SkipAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair' })
  @Post('refresh')
  public async updateRefreshToken(
    @CurrentUser() userData: IUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshSessionResponseDto> {
    const tokens = await this.authService.refreshToken(userData);
    this.authCookieService.setAuthCookies(res, tokens);
    return { success: true };
  }
}
