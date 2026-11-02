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

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
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
  @ApiProperty({ example: 'Борщ' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DishVisibility })
  @IsEnum(DishVisibility)
  visibility: DishVisibility;

  @ApiProperty({ enum: DishDifficulty })
  @IsEnum(DishDifficulty)
  difficulty: DishDifficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  prepTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  cookTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.1)
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

  @ApiPropertyOptional({ type: [DishPhotoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishPhotoDto)
  photos?: DishPhotoDto[];
}

export class CreateDishDto extends DishWritableDto {}

export class UpdateDishDto extends PartialType(DishWritableDto) {}
