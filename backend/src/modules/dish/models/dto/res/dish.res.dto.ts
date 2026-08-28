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

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameUk: string;

  @ApiProperty()
  order: number;
}

export class DishStepResDto {
  @ApiProperty()
  order: number;

  @ApiProperty()
  instructionEn: string;

  @ApiProperty()
  instructionUk: string;

  @ApiPropertyOptional({ nullable: true })
  photoKey?: string | null;
}

export class DishPhotoResDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  order: number;
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
  titleEn: string;

  @ApiProperty()
  titleUk: string;

  @ApiPropertyOptional()
  descriptionEn?: string;

  @ApiPropertyOptional()
  descriptionUk?: string;

  @ApiPropertyOptional()
  noteEn?: string;

  @ApiPropertyOptional()
  noteUk?: string;

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
  originalDishId?: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  likesCount: number;

  @ApiPropertyOptional()
  isSaved?: boolean;

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
