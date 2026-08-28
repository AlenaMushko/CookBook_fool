import { Injectable } from '@nestjs/common';
import { DishVisibility, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import {
  DishesListReqDto,
  DishListScope,
  DishListSort,
} from '../models/dto/req/dishes-list.req.dto';

const dishListInclude = {
  _count: { select: { likes: true } },
} satisfies Prisma.DishInclude;

const dishDetailInclude = {
  category: true,
  subcategory: true,
  owner: {
    select: { id: true, firstName: true, lastName: true },
  },
  ingredientGroups: { orderBy: { order: 'asc' as const } },
  ingredients: {
    orderBy: { order: 'asc' as const },
    include: {
      ingredient: true,
      unit: true,
    },
  },
  _count: { select: { likes: true } },
} satisfies Prisma.DishInclude;

export type DishListItem = Prisma.DishGetPayload<{
  include: typeof dishListInclude;
}>;

export type DishWithRelations = Prisma.DishGetPayload<{
  include: typeof dishDetailInclude;
}>;

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getList(
    query: DishesListReqDto,
    userId?: string,
    savedDishIds?: string[],
  ): Promise<[DishListItem[], number]> {
    const {
      limit = 12,
      offset = 0,
      categoryId,
      subcategoryId,
      search,
      difficulty,
      maxCookTime,
      visibility,
      scope = DishListScope.PUBLIC,
      sort = DishListSort.POPULARITY,
    } = query;

    const matchingIngredientIds = search
      ? await this.findIngredientIdsBySearch(search)
      : undefined;

    const where = this.buildWhere({
      categoryId,
      subcategoryId,
      search,
      matchingIngredientIds,
      difficulty,
      maxCookTime,
      visibility,
      scope,
      userId,
      savedDishIds,
    });

    const orderBy = this.buildOrderBy(sort);

    const [dishes, total] = await this.prisma.$transaction([
      this.prisma.dish.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: dishListInclude,
      }),
      this.prisma.dish.count({ where }),
    ]);

    return [dishes, total];
  }

  public async findDishById(id: string): Promise<DishWithRelations | null> {
    return await this.prisma.dish.findUnique({
      where: { id },
      include: dishDetailInclude,
    });
  }

  public async create(
    data: Prisma.DishUncheckedCreateInput,
  ): Promise<DishWithRelations> {
    return await this.prisma.dish.create({
      data,
      include: dishDetailInclude,
    });
  }

  public async update(
    id: string,
    data: Prisma.DishUncheckedUpdateInput,
  ): Promise<DishWithRelations> {
    return await this.prisma.dish.update({
      where: { id },
      data,
      include: dishDetailInclude,
    });
  }

  public async deleteDishById(id: string): Promise<void> {
    await this.prisma.dish.delete({ where: { id } });
  }

  public async createWithRelations(
    dishData: Prisma.DishUncheckedCreateInput,
    groups: Array<{
      tempId: string;
      nameEn: string;
      nameUk: string;
      order: number;
    }>,
    ingredients: Array<{
      ingredientId: string;
      unitId: string;
      quantity: number;
      groupTempId?: string;
      order: number;
    }>,
  ): Promise<DishWithRelations> {
    return await this.prisma.$transaction(async (tx) => {
      const dish = await tx.dish.create({ data: dishData });

      const groupIdMap = new Map<string, string>();
      for (const group of groups) {
        const created = await tx.dishIngredientGroup.create({
          data: {
            dishId: dish.id,
            nameEn: group.nameEn,
            nameUk: group.nameUk,
            order: group.order,
          },
        });
        groupIdMap.set(group.tempId, created.id);
      }

      for (const ing of ingredients) {
        await tx.dishIngredient.create({
          data: {
            dishId: dish.id,
            ingredientId: ing.ingredientId,
            unitId: ing.unitId,
            quantity: ing.quantity,
            groupId: ing.groupTempId
              ? (groupIdMap.get(ing.groupTempId) ?? null)
              : null,
            order: ing.order,
          },
        });
      }

      return await tx.dish.findUniqueOrThrow({
        where: { id: dish.id },
        include: dishDetailInclude,
      });
    });
  }

  public async updateWithRelations(
    id: string,
    dishData: Prisma.DishUncheckedUpdateInput,
    groups?: Array<{
      tempId: string;
      nameEn: string;
      nameUk: string;
      order: number;
    }>,
    ingredients?: Array<{
      ingredientId: string;
      unitId: string;
      quantity: number;
      groupTempId?: string;
      order: number;
    }>,
  ): Promise<DishWithRelations> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.dish.update({ where: { id }, data: dishData });

      if (groups !== undefined && ingredients !== undefined) {
        await tx.dishIngredient.deleteMany({ where: { dishId: id } });
        await tx.dishIngredientGroup.deleteMany({ where: { dishId: id } });

        const groupIdMap = new Map<string, string>();
        for (const group of groups) {
          const created = await tx.dishIngredientGroup.create({
            data: {
              dishId: id,
              nameEn: group.nameEn,
              nameUk: group.nameUk,
              order: group.order,
            },
          });
          groupIdMap.set(group.tempId, created.id);
        }

        for (const ing of ingredients) {
          await tx.dishIngredient.create({
            data: {
              dishId: id,
              ingredientId: ing.ingredientId,
              unitId: ing.unitId,
              quantity: ing.quantity,
              groupId: ing.groupTempId
                ? (groupIdMap.get(ing.groupTempId) ?? null)
                : null,
              order: ing.order,
            },
          });
        }
      }

      return await tx.dish.findUniqueOrThrow({
        where: { id },
        include: dishDetailInclude,
      });
    });
  }

  public async duplicateDish(
    source: DishWithRelations,
    ownerId: string,
  ): Promise<DishWithRelations> {
    return await this.prisma.$transaction(async (tx) => {
      const dish = await tx.dish.create({
        data: {
          titleEn: source.titleEn,
          titleUk: source.titleUk,
          descriptionEn: source.descriptionEn,
          descriptionUk: source.descriptionUk,
          noteEn: source.noteEn,
          noteUk: source.noteUk,
          visibility: DishVisibility.PRIVATE,
          difficulty: source.difficulty,
          prepTime: source.prepTime,
          cookTime: source.cookTime,
          baseServings: source.baseServings,
          steps: source.steps as Prisma.InputJsonValue,
          photos: [],
          ownerId,
          categoryId: source.categoryId,
          subcategoryId: source.subcategoryId,
          originalDishId: source.id,
        },
      });

      const groupIdMap = new Map<string, string>();
      for (const group of source.ingredientGroups) {
        const created = await tx.dishIngredientGroup.create({
          data: {
            dishId: dish.id,
            nameEn: group.nameEn,
            nameUk: group.nameUk,
            order: group.order,
          },
        });
        groupIdMap.set(group.id, created.id);
      }

      for (const ing of source.ingredients) {
        await tx.dishIngredient.create({
          data: {
            dishId: dish.id,
            ingredientId: ing.ingredientId,
            unitId: ing.unitId,
            quantity: ing.quantity,
            groupId: ing.groupId ? (groupIdMap.get(ing.groupId) ?? null) : null,
            order: ing.order,
          },
        });
      }

      return await tx.dish.findUniqueOrThrow({
        where: { id: dish.id },
        include: dishDetailInclude,
      });
    });
  }

  private async findIngredientIdsBySearch(search: string): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "ingredients"
      WHERE
        (en->>'name') ILIKE ${'%' + search + '%'}
        OR (uk->>'name') ILIKE ${'%' + search + '%'}
    `;
    return rows.map((row) => row.id);
  }

  private buildWhere(params: {
    categoryId?: string;
    subcategoryId?: string;
    search?: string;
    matchingIngredientIds?: string[];
    difficulty?: string;
    maxCookTime?: number;
    visibility?: DishVisibility;
    scope: DishListScope;
    userId?: string;
    savedDishIds?: string[];
  }): Prisma.DishWhereInput {
    const {
      categoryId,
      subcategoryId,
      search,
      matchingIngredientIds,
      difficulty,
      maxCookTime,
      visibility,
      scope,
      userId,
      savedDishIds,
    } = params;

    const and: Prisma.DishWhereInput[] = [];

    if (categoryId) and.push({ categoryId });
    if (subcategoryId) and.push({ subcategoryId });
    if (difficulty) and.push({ difficulty: difficulty as never });
    if (maxCookTime !== undefined) and.push({ cookTime: { lte: maxCookTime } });

    if (search) {
      const searchConditions: Prisma.DishWhereInput[] = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUk: { contains: search, mode: 'insensitive' } },
        {
          category: {
            OR: [
              { nameEn: { contains: search, mode: 'insensitive' } },
              { nameUk: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          subcategory: {
            OR: [
              { nameEn: { contains: search, mode: 'insensitive' } },
              { nameUk: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];

      if (matchingIngredientIds?.length) {
        searchConditions.push({
          ingredients: {
            some: { ingredientId: { in: matchingIngredientIds } },
          },
        });
      }

      and.push({ OR: searchConditions });
    }

    switch (scope) {
      case DishListScope.CREATED:
        and.push({ ownerId: userId });
        if (visibility) and.push({ visibility });
        break;
      case DishListScope.SAVED:
        and.push({ id: { in: savedDishIds ?? [] } });
        break;
      case DishListScope.COOKBOOK:
        and.push({
          OR: [{ ownerId: userId }, { id: { in: savedDishIds ?? [] } }],
        });
        break;
      default:
        and.push({ visibility: DishVisibility.PUBLIC });
        break;
    }

    return and.length > 0 ? { AND: and } : {};
  }

  private buildOrderBy(
    sort: DishListSort,
  ): Prisma.DishOrderByWithRelationInput[] {
    switch (sort) {
      case DishListSort.OLDEST:
        return [{ created: 'asc' }, { id: 'asc' }];
      case DishListSort.ALPHABETICAL:
        return [{ titleEn: 'asc' }, { id: 'asc' }];
      case DishListSort.COOK_TIME:
        return [
          { cookTime: { sort: 'asc', nulls: 'last' } },
          { created: 'desc' },
          { id: 'desc' },
        ];
      case DishListSort.DIFFICULTY:
        return [{ difficulty: 'asc' }, { created: 'desc' }, { id: 'desc' }];
      case DishListSort.NEWEST:
        return [{ created: 'desc' }, { id: 'desc' }];
      case DishListSort.POPULARITY:
      default:
        return [
          { likes: { _count: 'desc' } },
          { created: 'desc' },
          { id: 'desc' },
        ];
    }
  }
}
