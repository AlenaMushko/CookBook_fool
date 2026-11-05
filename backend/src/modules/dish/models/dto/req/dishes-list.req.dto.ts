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
  CREATED_BY_ME = 'createdByMe',
  SAVED = 'saved',
  COOKBOOK = 'cookbook',
}

export enum DishListSort {
  CREATED = 'created',
  SAVED = 'saved',
  COOKED = 'cooked',
  DIFFICULTY = 'difficulty',
}

export enum DishListOrder {
  ASC = 'asc',
  DESC = 'desc',
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

  @ApiPropertyOptional({ enum: DishDifficulty, enumName: 'DishDifficulty' })
  @IsOptional()
  @IsEnum(DishDifficulty)
  difficulty?: DishDifficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxCookTime?: number;

  @ApiPropertyOptional({ enum: DishVisibility, enumName: 'DishVisibility' })
  @IsOptional()
  @IsEnum(DishVisibility)
  visibility?: DishVisibility;

  @ApiPropertyOptional({
    enum: DishListScope,
    enumName: 'DishListScope',
    default: DishListScope.PUBLIC,
  })
  @IsOptional()
  @IsEnum(DishListScope)
  scope?: DishListScope = DishListScope.PUBLIC;

  @ApiPropertyOptional({
    enum: DishListSort,
    enumName: 'DishListSort',
    default: DishListSort.SAVED,
  })
  @IsOptional()
  @IsEnum(DishListSort)
  sort?: DishListSort = DishListSort.SAVED;

  @ApiPropertyOptional({
    enum: DishListOrder,
    enumName: 'DishListOrder',
    default: DishListOrder.DESC,
  })
  @IsOptional()
  @IsEnum(DishListOrder)
  order?: DishListOrder = DishListOrder.DESC;
}
