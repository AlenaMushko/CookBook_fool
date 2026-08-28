import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class ConvertRequestDto {
  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty()
  @IsUUID()
  fromUnitId: string;

  @ApiProperty()
  @IsUUID()
  toUnitId: string;
}

export class ConvertResponseDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  source: string;

  @ApiProperty({
    description: 'True when conversion used a personal override',
  })
  isPersonal: boolean;

  @ApiProperty({
    description: 'True when the active rule belongs to the current user',
  })
  isOwner: boolean;

  @ApiPropertyOptional({
    description:
      'Id of personal rule — use for PATCH/DELETE when isOwner is true',
  })
  userRuleId?: string;
}

export class CreateUserConversionDto {
  @ApiProperty({ description: 'Ingredient this personal rule applies to' })
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsUUID()
  fromUnitId: string;

  @ApiProperty()
  @IsUUID()
  toUnitId: string;

  @ApiProperty({ description: 'Multiplier: result = quantity × factor' })
  @IsNumber()
  @Min(0.000001)
  factor: number;
}

export class UpdateUserConversionDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.000001)
  factor: number;
}

export class UserConversionResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ingredientId: string;

  @ApiProperty()
  fromUnitId: string;

  @ApiProperty()
  toUnitId: string;

  @ApiProperty()
  factor: number;

  @ApiProperty({
    description:
      'Always true — records from /user/me/conversions belong to you',
  })
  isOwner: boolean;
}

export class UserConversionListResDto {
  @ApiProperty({ type: [UserConversionResDto] })
  data: UserConversionResDto[];
}

export class DeleteUserConversionResDto {
  @ApiProperty()
  success: true;
}

export class GetEffectiveConversionQueryDto {
  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsUUID()
  fromUnitId: string;

  @ApiProperty()
  @IsUUID()
  toUnitId: string;
}

export class EffectiveConversionResDto {
  @ApiProperty()
  factor: number;

  @ApiProperty({
    enum: [
      'USER_INGREDIENT_RULE',
      'GLOBAL_INGREDIENT_RULE',
      'GENERIC_UNIT_RULE',
    ],
  })
  source: string;

  @ApiProperty({
    description: 'True when value comes from a personal override',
  })
  isPersonal: boolean;

  @ApiProperty({
    description:
      'True when the active rule is yours — show edit/delete on frontend',
  })
  isOwner: boolean;

  @ApiPropertyOptional({
    description: 'Present when isOwner is true — id for PATCH/DELETE',
  })
  userRuleId?: string;
}
