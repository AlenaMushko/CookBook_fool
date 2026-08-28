import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;
}
