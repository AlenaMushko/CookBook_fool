import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import {
  ConvertRequestDto,
  ConvertResponseDto,
  CreateUserConversionDto,
  DeleteUserConversionResDto,
  EffectiveConversionResDto,
  GetEffectiveConversionQueryDto,
  UpdateUserConversionDto,
  UserConversionListResDto,
  UserConversionResDto,
} from './models/conversion.dto';
import { ConversionService } from './services/conversion.service';

@ApiBearerAuth()
@ApiTags('Conversions')
@Controller()
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Post('conversions/convert')
  @ApiOperation({ summary: 'Convert ingredient quantity between units' })
  public async convert(
    @Body() dto: ConvertRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<ConvertResponseDto> {
    return this.conversionService.convert(dto, userData);
  }

  @Get('conversions/effective')
  @ApiOperation({
    summary:
      'Get effective conversion factor (personal override or global default)',
  })
  public async getEffectiveConversion(
    @Query() query: GetEffectiveConversionQueryDto,
    @CurrentUser() userData: IUserData,
  ): Promise<EffectiveConversionResDto> {
    return this.conversionService.getEffectiveConversion(query, userData);
  }

  @Get('user/me/conversions')
  @ApiOperation({ summary: 'List personal conversion rules (only yours)' })
  public async getUserConversions(
    @CurrentUser() userData: IUserData,
  ): Promise<UserConversionListResDto> {
    return this.conversionService.getUserConversions(userData);
  }

  @Post('user/me/conversions')
  @ApiOperation({
    summary:
      'Save personal conversion rule (create or update — visible only to you)',
  })
  public async saveUserConversion(
    @Body() dto: CreateUserConversionDto,
    @CurrentUser() userData: IUserData,
  ): Promise<UserConversionResDto> {
    return this.conversionService.saveUserConversion(dto, userData);
  }

  @Patch('user/me/conversions/:id')
  @ApiOperation({ summary: 'Update personal conversion rule by id' })
  public async updateUserConversion(
    @Param('id') id: string,
    @Body() dto: UpdateUserConversionDto,
    @CurrentUser() userData: IUserData,
  ): Promise<UserConversionResDto> {
    return this.conversionService.updateUserConversion(id, dto, userData);
  }

  @Delete('user/me/conversions/:id')
  @ApiOperation({
    summary: 'Delete your personal rule — falls back to global default',
  })
  public async deleteUserConversion(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ): Promise<DeleteUserConversionResDto> {
    return this.conversionService.deleteUserConversion(id, userData);
  }
}
