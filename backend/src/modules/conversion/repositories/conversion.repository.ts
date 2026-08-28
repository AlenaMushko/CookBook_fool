import { Injectable } from '@nestjs/common';
import { UserConversionRule } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConversionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findUserIngredientRule(
    userId: string,
    ingredientId: string,
    fromUnitId: string,
    toUnitId: string,
  ) {
    return this.prisma.userConversionRule.findUnique({
      where: {
        userId_ingredientId_fromUnitId_toUnitId: {
          userId,
          ingredientId,
          fromUnitId,
          toUnitId,
        },
      },
    });
  }

  public async findGlobalIngredientRule(
    ingredientId: string,
    fromUnitId: string,
    toUnitId: string,
  ) {
    return this.prisma.conversionRule.findFirst({
      where: { ingredientId, fromUnitId, toUnitId },
    });
  }

  public async findGenericUnitRule(fromUnitId: string, toUnitId: string) {
    return this.prisma.conversionRule.findFirst({
      where: { ingredientId: null, fromUnitId, toUnitId },
    });
  }

  public async findUserRules(userId: string): Promise<UserConversionRule[]> {
    return this.prisma.userConversionRule.findMany({
      where: { userId },
      orderBy: { ingredientId: 'asc' },
    });
  }

  public async upsertUserRule(data: {
    userId: string;
    ingredientId: string;
    fromUnitId: string;
    toUnitId: string;
    factor: number;
  }): Promise<UserConversionRule> {
    return this.prisma.userConversionRule.upsert({
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
    });
  }

  public async updateUserRule(
    id: string,
    userId: string,
    factor: number,
  ): Promise<UserConversionRule | null> {
    const existing = await this.prisma.userConversionRule.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return null;
    }

    return this.prisma.userConversionRule.update({
      where: { id },
      data: { factor },
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
    return this.prisma.userConversionRule.findFirst({
      where: { id, userId },
    });
  }
}
