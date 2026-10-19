import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
} from '../../constants/user.constants';

export class BaseUserReqDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  lastName?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(PASSWORD_REGEX, {
    message: 'Password must include uppercase, lowercase, and a number',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in E.164 format (e.g., +123456789)',
  })
  phone?: string;
}
