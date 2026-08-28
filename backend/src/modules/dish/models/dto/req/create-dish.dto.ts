import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  ValidateNested,
} from 'class-validator';

export class DishStepDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty()
  @IsString()
  instructionEn: string;

  @ApiProperty()
  @IsString()
  instructionUk: string;

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

  @ApiProperty()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsString()
  nameUk: string;

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

export class CreateDishDto {
  @ApiProperty()
  @IsString()
  titleEn: string;

  @ApiProperty()
  @IsString()
  titleUk: string;

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
