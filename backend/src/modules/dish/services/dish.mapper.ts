import { IngredientJson } from '../../ingredient/repositories/ingredient.repository';
import { DishesListReqDto } from '../models/dto/req/dishes-list.req.dto';
import {
  DishListItemResDto,
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
  title?: string | null;
  description?: string | null;
  instructionEn?: string | null;
  instructionUk?: string | null;
  titleEn?: string | null;
  titleUk?: string | null;
  photoKey?: string | null;
  photos?: DishPhotoJson[] | null;
};

type DishPhotoJson = {
  key: string;
  order: number;
};

export class DishMapper {
  public static toResponseDto(
    entity: DishListItem | DishWithRelations,
    options?: { userId?: string; isLiked?: boolean },
  ): DishResDto {
    const steps = (entity.steps as DishStepJson[]) ?? [];
    const photos = Array.isArray(entity.photos)
      ? (entity.photos as DishPhotoJson[]).map((photo) => ({
          key: photo.key,
          order: photo.order,
          url: undefined,
        }))
      : undefined;

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ?? undefined,
      visibility: entity.visibility,
      difficulty: entity.difficulty,
      cookTime: entity.cookTime ?? undefined,
      baseServings: entity.baseServings
        ? Number(entity.baseServings)
        : undefined,
      steps: steps.map((step) => ({
        order: step.order,
        title: step.title ?? step.titleUk ?? step.titleEn ?? undefined,
        description:
          step.description ??
          step.instructionUk ??
          step.instructionEn ??
          undefined,
        photoKey: step.photoKey ?? step.photos?.[0]?.key ?? null,
        photos: (
          step.photos ??
          (step.photoKey ? [{ key: step.photoKey, order: 0 }] : undefined)
        )?.map((photo) => ({
          key: photo.key,
          order: photo.order,
          url: undefined,
        })),
      })),
      photos,
      categoryId: entity.categoryId,
      subcategoryId: entity.subcategoryId ?? undefined,
      areaId: entity.areaId ?? undefined,
      originalDishId: entity.originalDishId ?? undefined,
      ownerId: entity.ownerId,
      likesCount: entity._count?.likes ?? 0,
      isLiked: options?.isLiked,
      isOwner: options?.userId ? entity.ownerId === options.userId : undefined,
      created: entity.created,
    };
  }

  public static toListResponseDto(
    entities: DishListItem[],
    total: number,
    query: DishesListReqDto,
    userId?: string,
    likedDishIds?: string[],
  ): DishListResDto {
    const liked = new Set(likedDishIds ?? []);

    return {
      data: entities.map((entity) =>
        this.toListItemDto(
          entity,
          userId,
          likedDishIds ? liked.has(entity.id) : undefined,
        ),
      ),
      meta: {
        limit: query.limit ?? 12,
        offset: query.offset ?? 0,
        total,
      },
    };
  }

  private static toListItemDto(
    entity: DishListItem,
    userId: string | undefined,
    isLiked: boolean | undefined,
  ): DishListItemResDto {
    return {
      ...this.toResponseDto(entity, { userId, isLiked }),
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
    };
  }

  public static toParsedResponseDto(
    entity: DishWithRelations,
    options?: { userId?: string; isLiked?: boolean },
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
      area: entity.area
        ? {
            id: entity.area.id,
            code: entity.area.code,
            nameEn: entity.area.nameEn,
            nameUk: entity.area.nameUk,
            flagSvg: entity.area.flagSvg,
            flagAlt: entity.area.flagAlt,
          }
        : undefined,
      ingredientGroups: entity.ingredientGroups.map((g) => ({
        id: g.id,
        name: g.name ?? undefined,
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
          image: ing.ingredient.image,
          unitId: ing.unitId,
          quantity: Number(ing.quantity),
          groupId: ing.groupId ?? undefined,
          order: ing.order,
        };
      }),
    };
  }
}
