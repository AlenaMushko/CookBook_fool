import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { PHONE_REGEX } from '../../constants/user.constants';

export class UpdateUserReqDto {
  @ApiPropertyOptional({ example: 'John', minLength: 3, maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => TransformHelper.trim(value))
  @Type(() => String)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', minLength: 3, maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => TransformHelper.trim(value))
  @Type(() => String)
  lastName?: string;

  @ApiPropertyOptional({ example: '+380991234567' })
  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in E.164 format (e.g., +123456789)',
  })
  phone?: string;

  @ApiPropertyOptional({ example: 'users/avatar.webp' })
  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;
}
