import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { EMAIL_REGEX } from '../../../user/models/constants/user.constants';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(1, 300)
  @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
  email: string;
}
