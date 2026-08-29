import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { ContentLocale, DishDifficulty, DishVisibility } from '@prisma/client';
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
  ValidateNested,
} from 'class-validator';

import { AtLeastOneOf } from '../../../../../common/decorators/at-least-one-of.decorator';

export class DishStepDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional()
  @AtLeastOneOf(['instructionEn', 'instructionUk'], {
    message: 'At least one of instructionEn or instructionUk must be provided',
  })
  @IsOptional()
  @IsString()
  instructionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructionUk?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  photoKey?: string | null;
}

export class DishPhotoDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ enum: ['MAIN', 'GALLERY'] })
  @IsString()
  type: 'MAIN' | 'GALLERY';

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class DishIngredientGroupDto {
  @ApiProperty()
  @IsString()
  tempId: string;

  @ApiPropertyOptional()
  @AtLeastOneOf(['nameEn', 'nameUk'], {
    message: 'At least one of nameEn or nameUk must be provided',
  })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameUk?: string;

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

/** Shared writable fields (title pair constraint only on Create). */
export class DishWritableDto {
  @ApiProperty({
    enum: ContentLocale,
    example: ContentLocale.UK,
    description: 'Primary language of this dish content (which side to fill)',
  })
  @IsEnum(ContentLocale)
  locale: ContentLocale;

  @ApiPropertyOptional({ example: 'Borscht' })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({ example: 'Борщ' })
  @IsOptional()
  @IsString()
  titleUk?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionUk?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noteEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noteUk?: string;

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

  @ApiProperty({ type: [DishStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishStepDto)
  steps: DishStepDto[];

  @ApiPropertyOptional({ type: [DishPhotoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishPhotoDto)
  photos?: DishPhotoDto[];
}

export class CreateDishDto extends DishWritableDto {
  @ApiPropertyOptional({ example: 'Borscht' })
  @AtLeastOneOf(['titleEn', 'titleUk'], {
    message: 'At least one of titleEn or titleUk must be provided',
  })
  @IsOptional()
  @IsString()
  declare titleEn?: string;
}

export class UpdateDishDto extends PartialType(
  OmitType(DishWritableDto, ['locale'] as const),
) {}
