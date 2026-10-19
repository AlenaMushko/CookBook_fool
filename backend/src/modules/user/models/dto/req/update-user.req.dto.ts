import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

import { PHONE_REGEX } from '../../constants/user.constants';

function emptyToNull({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) {
    return value === undefined ? undefined : null;
  }
  return value;
}

export class UpdateUserReqDto {
  @ApiPropertyOptional({ example: 'John', minLength: 3, maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', minLength: 3, maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  lastName?: string;

  @ApiPropertyOptional({ example: '+380991234567', nullable: true })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsString()
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in E.164 format (e.g., +123456789)',
  })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'avatars/abc.webp', nullable: true })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value != null)
  @IsString()
  @Length(1, 3000)
  image?: string | null;
}
