import { IngredientJson } from '../../ingredient/repositories/ingredient.repository';
import { DishesListReqDto } from '../models/dto/req/dishes-list.req.dto';
import {
  DishListResDto,
  DishResDto,
  ParsedDishResDto,
} from '../models/dto/res/dish.res.dto';
import {
  DishListItem,
  DishWithRelations,
} from '../repositories/dish.repository';

type DishStepJson = {
  order: number;
  instructionEn: string;
  instructionUk: string;
  photoKey?: string | null;
};

type DishPhotoJson = {
  key: string;
  type: string;
  order: number;
};

export class DishMapper {
  public static toResponseDto(
    entity: DishListItem | DishWithRelations,
    options?: { userId?: string; isSaved?: boolean },
  ): DishResDto {
    const steps = (entity.steps as DishStepJson[]) ?? [];
    const photos = entity.photos
      ? ((entity.photos as DishPhotoJson[]) ?? undefined)
      : undefined;

    return {
      id: entity.id,
      titleEn: entity.titleEn,
      titleUk: entity.titleUk,
      descriptionEn: entity.descriptionEn ?? undefined,
      descriptionUk: entity.descriptionUk ?? undefined,
      noteEn: entity.noteEn ?? undefined,
      noteUk: entity.noteUk ?? undefined,
      visibility: entity.visibility,
      difficulty: entity.difficulty,
      prepTime: entity.prepTime ?? undefined,
      cookTime: entity.cookTime ?? undefined,
      baseServings: entity.baseServings
        ? Number(entity.baseServings)
        : undefined,
      steps,
      photos,
      categoryId: entity.categoryId,
      subcategoryId: entity.subcategoryId ?? undefined,
      originalDishId: entity.originalDishId ?? undefined,
      ownerId: entity.ownerId,
      likesCount: entity._count?.likes ?? 0,
      isSaved: options?.isSaved,
      isOwner: options?.userId ? entity.ownerId === options.userId : undefined,
      created: entity.created,
    };
  }

  public static toListResponseDto(
    entities: DishListItem[],
    total: number,
    query: DishesListReqDto,
    savedIds?: Set<string>,
    userId?: string,
  ): DishListResDto {
    return {
      data: entities.map((entity) =>
        this.toResponseDto(entity, {
          userId,
          isSaved: savedIds?.has(entity.id),
        }),
      ),
      meta: {
        limit: query.limit ?? 12,
        offset: query.offset ?? 0,
        total,
      },
    };
  }

  public static toParsedResponseDto(
    entity: DishWithRelations,
    options?: { userId?: string; isSaved?: boolean },
  ): ParsedDishResDto {
    return {
      ...this.toResponseDto(entity, options),
      owner: {
        id: entity.owner.id,
        firstName: entity.owner.firstName,
        lastName: entity.owner.lastName ?? undefined,
      },
      category: {
        id: entity.category.id,
        nameEn: entity.category.nameEn,
        nameUk: entity.category.nameUk,
        slug: entity.category.slug,
      },
      subcategory: entity.subcategory
        ? {
            id: entity.subcategory.id,
            nameEn: entity.subcategory.nameEn,
            nameUk: entity.subcategory.nameUk,
            slug: entity.subcategory.slug,
          }
        : undefined,
      ingredientGroups: entity.ingredientGroups.map((g) => ({
        id: g.id,
        nameEn: g.nameEn,
        nameUk: g.nameUk,
        order: g.order,
      })),
      ingredients: entity.ingredients.map((ing) => {
        const en = ing.ingredient.en as IngredientJson;
        const uk = ing.ingredient.uk as IngredientJson;
        return {
          id: ing.id,
          ingredientId: ing.ingredientId,
          nameEn: en.name,
          nameUk: uk.name,
          unitId: ing.unitId,
          quantity: Number(ing.quantity),
          groupId: ing.groupId ?? undefined,
          order: ing.order,
        };
      }),
    };
  }
}
