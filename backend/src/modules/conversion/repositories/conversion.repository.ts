import { Injectable } from '@nestjs/common';
import { Prisma, UserConversionRule } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

const userConversionRuleSelect = {
  id: true,
  ingredientId: true,
  fromUnitId: true,
  toUnitId: true,
  factor: true,
} satisfies Prisma.UserConversionRuleSelect;

export type UserConversionRuleItem = Prisma.UserConversionRuleGetPayload<{
  select: typeof userConversionRuleSelect;
}>;

@Injectable()
export class ConversionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findUserIngredientRule(
    userId: string,
    ingredientId: string,
    fromUnitId: string,
    toUnitId: string,
  ) {
    return await this.prisma.userConversionRule.findUnique({
      where: {
        userId_ingredientId_fromUnitId_toUnitId: {
          userId,
          ingredientId,
          fromUnitId,
          toUnitId,
        },
      },
      select: { id: true, factor: true },
    });
  }

  public async findGlobalIngredientRule(
    ingredientId: string,
    fromUnitId: string,
    toUnitId: string,
  ) {
    return await this.prisma.conversionRule.findFirst({
      where: { ingredientId, fromUnitId, toUnitId },
      select: { factor: true },
    });
  }

  public async findGenericUnitRule(fromUnitId: string, toUnitId: string) {
    return await this.prisma.conversionRule.findFirst({
      where: { ingredientId: null, fromUnitId, toUnitId },
      select: { factor: true },
    });
  }

  public async findUserRules(
    userId: string,
  ): Promise<UserConversionRuleItem[]> {
    return await this.prisma.userConversionRule.findMany({
      where: { userId },
      orderBy: { ingredientId: 'asc' },
      select: userConversionRuleSelect,
    });
  }

  public async upsertUserRule(data: {
    userId: string;
    ingredientId: string;
    fromUnitId: string;
    toUnitId: string;
    factor: number;
  }): Promise<UserConversionRuleItem> {
    return await this.prisma.userConversionRule.upsert({
      where: {
        userId_ingredientId_fromUnitId_toUnitId: {
          userId: data.userId,
          ingredientId: data.ingredientId,
          fromUnitId: data.fromUnitId,
          toUnitId: data.toUnitId,
        },
      },
      create: data,
      update: { factor: data.factor },
      select: userConversionRuleSelect,
    });
  }

  public async updateUserRule(
    id: string,
    userId: string,
    factor: number,
  ): Promise<UserConversionRuleItem | null> {
    const existing = await this.prisma.userConversionRule.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) {
      return null;
    }

    return await this.prisma.userConversionRule.update({
      where: { id },
      data: { factor },
      select: userConversionRuleSelect,
    });
  }

  public async deleteUserRule(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.userConversionRule.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  public async findUserRuleById(
    id: string,
    userId: string,
  ): Promise<UserConversionRule | null> {
    return await this.prisma.userConversionRule.findFirst({
      where: { id, userId },
    });
  }
}
