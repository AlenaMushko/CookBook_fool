import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { DishVisibility } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { CreateDishDto } from '../../dish/models/dto/req/create-dish.dto';

/** Same as create dish; visibility defaults to PRIVATE when omitted. */
export class CreateDishInMenuDto extends OmitType(CreateDishDto, [
  'visibility',
] as const) {
  @ApiPropertyOptional({
    enum: DishVisibility,
    enumName: 'DishVisibility',
    default: DishVisibility.PRIVATE,
  })
  @IsOptional()
  @IsEnum(DishVisibility)
  visibility?: DishVisibility;
}

export class CreateMenuDto {
  @ApiProperty({ example: 'New Year 2027' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    maxLength: 32,
    example: 'Різдво',
    description: 'Short occasion written by hand, not a date',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  occasion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateMenuDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ maxLength: 32, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  occasion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class CreateMenuSectionDto {
  @ApiProperty({ example: 'Desserts' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateMenuSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class AddMenuDishesDto {
  @ApiPropertyOptional({ type: [String] })
  @ValidateIf((o: AddMenuDishesDto) => o.dishIds !== undefined)
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  dishIds?: string[];

  @ApiPropertyOptional({ type: CreateDishInMenuDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDishInMenuDto)
  dish?: CreateDishInMenuDto;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Menu section id, or omit/null for no section',
  })
  @IsOptional()
  @IsUUID()
  sectionId?: string | null;
}

export class UpdateMenuDishDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUUID()
  sectionId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class MenuListQueryDto {
  @ApiPropertyOptional({ minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  excludeDishId?: string;
}
