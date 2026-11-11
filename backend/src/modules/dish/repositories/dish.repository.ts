import { Injectable } from '@nestjs/common';
import { DishVisibility, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import {
  DishesListReqDto,
  DishListOrder,
  DishListScope,
  DishListSort,
} from '../models/dto/req/dishes-list.req.dto';

const dishListInclude = {
  _count: { select: { likes: true } },
  category: {
    select: { id: true, nameEn: true, nameUk: true, slug: true },
  },
  subcategory: {
    select: { id: true, nameEn: true, nameUk: true, slug: true },
  },
  owner: {
    select: { id: true, firstName: true, lastName: true },
  },
  area: {
    select: {
      id: true,
      code: true,
      nameEn: true,
      nameUk: true,
      flagSvg: true,
      flagAlt: true,
    },
  },
} satisfies Prisma.DishInclude;

const dishDetailInclude = {
  category: {
    select: { id: true, nameEn: true, nameUk: true, slug: true },
  },
  subcategory: {
    select: { id: true, nameEn: true, nameUk: true, slug: true },
  },
  area: {
    select: {
      id: true,
      code: true,
      nameEn: true,
      nameUk: true,
      flagSvg: true,
      flagAlt: true,
    },
  },
  owner: {
    select: { id: true, firstName: true, lastName: true },
  },
  ingredientGroups: {
    orderBy: { order: 'asc' as const },
    select: { id: true, name: true, order: true },
  },
  ingredients: {
    orderBy: { order: 'asc' as const },
    select: {
      id: true,
      ingredientId: true,
      unitId: true,
      quantity: true,
      groupId: true,
      order: true,
      ingredient: { select: { en: true, uk: true, image: true } },
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
    likedDishIds?: string[],
  ): Promise<[DishListItem[], number]> {
    const {
      limit = 12,
      offset = 0,
      categoryId,
      subcategoryId,
      areaId,
      search,
      difficulty,
      maxCookTime,
      visibility,
      scope = DishListScope.PUBLIC,
      sort = DishListSort.SAVED,
      order = DishListOrder.DESC,
    } = query;

    const where = this.buildWhere({
      categoryId,
      subcategoryId,
      areaId,
      search,
      difficulty,
      maxCookTime,
      visibility,
      scope,
      userId,
      likedDishIds,
    });

    const orderBy = this.buildOrderBy(sort, order);

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

  public async existsOwnedTitle(
    ownerId: string,
    title: string,
    exceptId?: string,
  ): Promise<boolean> {
    const dish = await this.prisma.dish.findFirst({
      where: {
        ownerId,
        title: { equals: title, mode: 'insensitive' },
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(dish);
  }

  public async findDishById(id: string): Promise<DishWithRelations | null> {
    return await this.prisma.dish.findUnique({
      where: { id },
      include: dishDetailInclude,
    });
  }

  public async findGramsPerCup(
    ingredientIds: string[],
  ): Promise<Map<string, number>> {
    const uniqueIds = [...new Set(ingredientIds)];
    if (uniqueIds.length === 0) return new Map();

    const units = await this.prisma.measurementUnit.findMany({
      where: { code: { in: ['cup', 'g'] } },
      select: { id: true, code: true },
    });
    const cupId = units.find((unit) => unit.code === 'cup')?.id;
    const gramId = units.find((unit) => unit.code === 'g')?.id;
    if (!cupId || !gramId) return new Map();

    const rules = await this.prisma.conversionRule.findMany({
      where: {
        ingredientId: { in: uniqueIds },
        fromUnitId: cupId,
        toUnitId: gramId,
      },
      select: { ingredientId: true, factor: true },
    });

    return new Map(
      rules.flatMap((rule) =>
        rule.ingredientId
          ? [[rule.ingredientId, Number(rule.factor)] as const]
          : [],
      ),
    );
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
      name?: string;
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
            name: group.name,
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
      name?: string;
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
              name: group.name,
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

  private buildWhere(params: {
    categoryId?: string;
    subcategoryId?: string;
    areaId?: string;
    search?: string;
    difficulty?: string;
    maxCookTime?: number;
    visibility?: DishVisibility;
    scope: DishListScope;
    userId?: string;
    likedDishIds?: string[];
  }): Prisma.DishWhereInput {
    const {
      categoryId,
      subcategoryId,
      areaId,
      search,
      difficulty,
      maxCookTime,
      visibility,
      scope,
      userId,
      likedDishIds,
    } = params;

    const and: Prisma.DishWhereInput[] = [];

    if (categoryId) and.push({ categoryId });
    if (subcategoryId) and.push({ subcategoryId });
    if (areaId) and.push({ areaId });
    if (difficulty) and.push({ difficulty: difficulty as never });
    if (maxCookTime !== undefined) and.push({ cookTime: { lte: maxCookTime } });

    if (search) {
      and.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
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
        ],
      });
    }

    switch (scope) {
      case DishListScope.CREATED_BY_ME:
        and.push({ ownerId: userId });
        if (visibility) and.push({ visibility });
        break;
      case DishListScope.SAVED:
        and.push({ id: { in: likedDishIds ?? [] } });
        and.push({ visibility: DishVisibility.PUBLIC });
        break;
      case DishListScope.COOKBOOK:
        and.push({
          OR: [
            { ownerId: userId },
            {
              id: { in: likedDishIds ?? [] },
              visibility: DishVisibility.PUBLIC,
            },
          ],
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
    order: DishListOrder,
  ): Prisma.DishOrderByWithRelationInput[] {
    const direction = order === DishListOrder.ASC ? 'asc' : 'desc';
    const tie = [{ created: 'desc' as const }, { id: 'desc' as const }];

    switch (sort) {
      case DishListSort.CREATED:
        return [{ created: direction }, { id: direction }];
      case DishListSort.COOKED:
        return [{ cookTime: { sort: direction, nulls: 'last' } }, ...tie];
      case DishListSort.DIFFICULTY:
        return [{ difficulty: direction }, ...tie];
      case DishListSort.SAVED:
      default:
        return [{ likes: { _count: direction } }, ...tie];
    }
  }
}
