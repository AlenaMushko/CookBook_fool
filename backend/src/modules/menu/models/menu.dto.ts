import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
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
}

export class CreateMenuSectionDto {
  @ApiProperty()
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

export class AddMenuDishDto {
  @ApiProperty()
  @IsUUID()
  dishId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class ReorderMenuDishItemDto {
  @ApiProperty()
  @IsUUID()
  dishId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sectionId?: string;
}

export class ReorderMenuDishesDto {
  @ApiProperty({ type: [ReorderMenuDishItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderMenuDishItemDto)
  items: ReorderMenuDishItemDto[];
}
