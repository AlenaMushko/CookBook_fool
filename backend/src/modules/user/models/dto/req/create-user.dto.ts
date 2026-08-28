import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
} from '../../constants/user.constants';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value.toString().trim())
  @Type(() => String)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value?.toString().trim())
  @Type(() => String)
  lastName?: string;

  @IsString()
  @IsEmail()
  @Matches(EMAIL_REGEX, {
    message: 'Invalid email format',
  })
  @Type(() => String)
  email: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (@$!%*?&) and be at least 8 characters long',
  })
  @Type(() => String)
  password: string;

  @IsOptional()
  @Type(() => String)
  @Type(() => String)
  image?: string;

  @IsOptional()
  @Type(() => String)
  @Type(() => String)
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in E.164 format (e.g., +123456789)',
  })
  phone?: string;
}
