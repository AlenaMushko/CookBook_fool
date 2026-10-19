import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

import { Match } from '../../../../common/decorators/match.decorator';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from '../../../user/models/constants/user.constants';

export class SignUpRequestDto {
  @ApiProperty({ example: 'Olena', minLength: 3, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Type(() => String)
  firstName: string;

  @ApiProperty({ example: 'Kovalenko', minLength: 3, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Type(() => String)
  lastName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(1, 300)
  @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: 'Password must include uppercase, lowercase, and a number',
  })
  password: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty({ example: 'device-uuid' })
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
