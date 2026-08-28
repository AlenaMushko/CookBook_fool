import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nameEn: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nameUk: string;
}

export class IngredientSearchQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class IngredientResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;
}

export class IngredientListResDto {
  @ApiProperty({ type: [IngredientResDto] })
  data: IngredientResDto[];
}
