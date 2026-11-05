import { ApiProperty } from '@nestjs/swagger';

export enum ResetTokenValidationStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  INVALID = 'invalid',
}

export class ValidateResetTokenResponseDto {
  @ApiProperty({
    enum: ResetTokenValidationStatus,
    enumName: 'ResetTokenValidationStatus',
  })
  status: ResetTokenValidationStatus;
}
