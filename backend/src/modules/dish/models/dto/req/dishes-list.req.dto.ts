import { ApiPropertyOptional } from '@nestjs/swagger';
import { DishDifficulty, DishVisibility } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum DishListScope {
  PUBLIC = 'public',
  CREATED = 'created',
  SAVED = 'saved',
  COOKBOOK = 'cookbook',
}

export enum DishListSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  ALPHABETICAL = 'alphabetical',
  POPULARITY = 'popularity',
  COOK_TIME = 'cookTime',
  DIFFICULTY = 'difficulty',
}

export class DishesListReqDto {
  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @ApiPropertyOptional({ enum: DishDifficulty })
  @IsOptional()
  @IsEnum(DishDifficulty)
  difficulty?: DishDifficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxCookTime?: number;

  @ApiPropertyOptional({ enum: DishVisibility })
  @IsOptional()
  @IsEnum(DishVisibility)
  visibility?: DishVisibility;

  @ApiPropertyOptional({ enum: DishListScope, default: DishListScope.PUBLIC })
  @IsOptional()
  @IsEnum(DishListScope)
  scope?: DishListScope = DishListScope.PUBLIC;

  @ApiPropertyOptional({ enum: DishListSort, default: DishListSort.POPULARITY })
  @IsOptional()
  @IsEnum(DishListSort)
  sort?: DishListSort = DishListSort.POPULARITY;
}
