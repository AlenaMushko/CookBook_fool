import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.findUserById(userData.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: Partial<UpdateUserReqDto>,
  ): Promise<UserResDto> {
    return await this.userService.update(userData.userId, updateUserDto);
  }
}
