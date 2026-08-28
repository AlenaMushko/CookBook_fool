import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

import { Match } from '../../../../common/decorators/match.decorator';
import { PASSWORD_REGEX } from '../../../user/models/constants/user.constants';

export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one digit',
  })
  password: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
