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
