import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { apiPath, ApiRoute } from '../../common/constants/api-route.enum';
import { AUTH_COOKIE_NAMES } from '../auth/constants/constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { S3Service } from '../s3/services/s3.service';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@ApiCookieAuth(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
@Controller(apiPath(ApiRoute.USER))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    const user = await this.userService.findUserById(userData.userId);
    return await this.withImageUrl(user);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const existing = await this.userService.findUserById(userData.userId);
    const previousImage = existing.image?.trim() || null;

    const updated = await this.userService.update(
      userData.userId,
      updateUserDto,
    );

    const nextImage = updated.image?.trim() || null;

    if (
      updateUserDto.image !== undefined &&
      previousImage &&
      previousImage !== nextImage
    ) {
      await this.s3Service.deleteKeysBestEffort([previousImage]);
    }

    return await this.withImageUrl(updated);
  }

  private async withImageUrl(user: UserResDto): Promise<UserResDto> {
    if (!user.image) {
      return { ...user, imageUrl: undefined };
    }

    try {
      const imageUrl = await this.s3Service.getSignedGetUrl(user.image);
      return { ...user, imageUrl };
    } catch {
      // Keep key for edits; omit URL so FE does not fall back to a private public URL.
      return { ...user, imageUrl: undefined };
    }
  }
}
