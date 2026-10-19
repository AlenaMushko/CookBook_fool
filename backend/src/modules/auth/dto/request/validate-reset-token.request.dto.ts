import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateResetTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
