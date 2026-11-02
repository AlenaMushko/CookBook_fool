import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DishDifficulty, DishVisibility } from '@prisma/client';

export class DishIngredientResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ingredientId: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiPropertyOptional({ nullable: true })
  image?: string | null;

  @ApiProperty()
  unitId: string;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  groupId?: string;

  @ApiProperty()
  order: number;
}

export class DishIngredientGroupResDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiProperty()
  order: number;
}

export class DishPhotoResDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  order: number;
}

export class DishStepResDto {
  @ApiProperty()
  order: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ nullable: true })
  photoKey?: string | null;

  @ApiPropertyOptional({ type: [DishPhotoResDto] })
  photos?: DishPhotoResDto[];
}

export class DishCategoryBriefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  slug: string;
}

export class DishSubcategoryBriefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  slug: string;
}

export class DishAreaBriefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  flagSvg: string;

  @ApiProperty()
  flagAlt: string;
}

export class DishOwnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName?: string;
}

export class DishResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: DishVisibility })
  visibility: DishVisibility;

  @ApiProperty({ enum: DishDifficulty })
  difficulty: DishDifficulty;

  @ApiPropertyOptional()
  prepTime?: number;

  @ApiPropertyOptional()
  cookTime?: number;

  @ApiPropertyOptional()
  baseServings?: number;

  @ApiProperty({ type: [DishStepResDto] })
  steps: DishStepResDto[];

  @ApiPropertyOptional({ type: [DishPhotoResDto] })
  photos?: DishPhotoResDto[];

  @ApiProperty()
  categoryId: string;

  @ApiPropertyOptional()
  subcategoryId?: string;

  @ApiPropertyOptional()
  areaId?: string;

  @ApiPropertyOptional()
  originalDishId?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  likesCount: number;

  @ApiPropertyOptional()
  isOwner?: boolean;

  @ApiProperty()
  created: Date;
}

export class ParsedDishResDto extends DishResDto {
  @ApiProperty({ type: DishOwnerDto })
  owner: DishOwnerDto;

  @ApiProperty({ type: DishCategoryBriefDto })
  category: DishCategoryBriefDto;

  @ApiPropertyOptional({ type: DishSubcategoryBriefDto })
  subcategory?: DishSubcategoryBriefDto;

  @ApiPropertyOptional({ type: DishAreaBriefDto })
  area?: DishAreaBriefDto;

  @ApiProperty({ type: [DishIngredientGroupResDto] })
  ingredientGroups: DishIngredientGroupResDto[];

  @ApiProperty({ type: [DishIngredientResDto] })
  ingredients: DishIngredientResDto[];
}

export class DishListMetaDto {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  total: number;
}

export class DishListResDto {
  @ApiProperty({ type: [DishResDto] })
  data: DishResDto[];

  @ApiProperty({ type: DishListMetaDto })
  meta: DishListMetaDto;
}
