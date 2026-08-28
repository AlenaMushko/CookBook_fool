import { Injectable } from '@nestjs/common';
import { Ingredient, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type IngredientJson = { name: string; desc?: string };

@Injectable()
export class IngredientRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async search(search: string, limit: number): Promise<Ingredient[]> {
    return await this.prisma.$queryRaw<Ingredient[]>`
      SELECT * FROM "ingredients"
      WHERE
        (en->>'name') ILIKE ${'%' + search + '%'}
        OR (uk->>'name') ILIKE ${'%' + search + '%'}
      ORDER BY (en->>'name') ASC
      LIMIT ${limit}
    `;
  }

  public async findByNormalizedName(
    nameEn: string,
    nameUk: string,
  ): Promise<Ingredient | null> {
    const normalizedEn = nameEn.trim().toLowerCase();
    const normalizedUk = nameUk.trim().toLowerCase();

    const ingredients = await this.prisma.$queryRaw<Ingredient[]>`
      SELECT * FROM "ingredients"
      WHERE
        LOWER(TRIM(en->>'name')) = ${normalizedEn}
        OR LOWER(TRIM(uk->>'name')) = ${normalizedUk}
      LIMIT 1
    `;

    return ingredients[0] ?? null;
  }

  public async findById(id: string): Promise<Ingredient | null> {
    return await this.prisma.ingredient.findUnique({ where: { id } });
  }

  public async create(data: Prisma.IngredientCreateInput): Promise<Ingredient> {
    return await this.prisma.ingredient.create({ data });
  }
}
