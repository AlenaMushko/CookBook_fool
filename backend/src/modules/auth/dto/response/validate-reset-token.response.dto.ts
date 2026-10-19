import { ApiProperty } from '@nestjs/swagger';

export type ResetTokenValidationStatus = 'valid' | 'expired' | 'invalid';

export class ValidateResetTokenResponseDto {
  @ApiProperty({ enum: ['valid', 'expired', 'invalid'] })
  status: ResetTokenValidationStatus;
}
