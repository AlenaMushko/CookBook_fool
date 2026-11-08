import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DishDifficulty, DishVisibility } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DishPhotoDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class DishStepDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  photoKey?: string | null;

  @ApiPropertyOptional({ type: [DishPhotoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishPhotoDto)
  photos?: DishPhotoDto[];
}

export class DishIngredientGroupDto {
  @ApiProperty()
  @IsString()
  tempId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class DishIngredientInputDto {
  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsUUID()
  unitId: string;

  @ApiProperty({
    minimum: 0.001,
    maximum: 9999999.999,
    example: 0.5,
    description:
      'Positive whole or fractional number with up to 3 decimal places. 1/2 is sent as 0.5, 1/3 as 0.333.',
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: 'Quantity must be a positive whole or fractional number' },
  )
  @Min(0.001, {
    message: 'Quantity must be a positive whole or fractional number',
  })
  @Max(9999999.999, {
    message: 'Quantity must be a positive whole or fractional number',
  })
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupTempId?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

/** Shared writable fields. */
export class DishWritableDto {
  @ApiProperty({ example: 'Борщ', minLength: 3, maxLength: 30 })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DishVisibility, enumName: 'DishVisibility' })
  @IsEnum(DishVisibility)
  visibility: DishVisibility;

  @ApiProperty({ enum: DishDifficulty, enumName: 'DishDifficulty' })
  @IsEnum(DishDifficulty)
  difficulty: DishDifficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  cookTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  baseServings?: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @ApiPropertyOptional({
    description: 'Country / cuisine area id (optional)',
  })
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @ApiPropertyOptional({ type: [DishIngredientGroupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishIngredientGroupDto)
  ingredientGroups?: DishIngredientGroupDto[];

  @ApiProperty({ type: [DishIngredientInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishIngredientInputDto)
  ingredients: DishIngredientInputDto[];

  @ApiPropertyOptional({
    type: [DishStepDto],
    description:
      'Optional. Omit the field or send an empty list. A step that is present requires a description. Its title and photo are optional.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishStepDto)
  steps?: DishStepDto[];

  @ApiPropertyOptional({
    type: [DishPhotoDto],
    description: 'Optional. Omit the field or send an empty list.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishPhotoDto)
  photos?: DishPhotoDto[];
}

export class CreateDishDto extends DishWritableDto {}

export class UpdateDishDto extends PartialType(DishWritableDto) {}
