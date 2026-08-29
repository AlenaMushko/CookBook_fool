import { Injectable } from '@nestjs/common';
import { Ingredient, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type IngredientJson = { name: string; desc?: string };

export type IngredientListItem = {
  id: string;
  nameEn: string;
  nameUk: string;
};

@Injectable()
export class IngredientRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async search(
    search: string,
    limit: number,
  ): Promise<IngredientListItem[]> {
    return await this.prisma.$queryRaw<IngredientListItem[]>`
      SELECT
        id,
        en->>'name' AS "nameEn",
        uk->>'name' AS "nameUk"
      FROM "ingredients"
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

  public async create(
    data: Prisma.IngredientCreateInput,
  ): Promise<IngredientListItem> {
    const ingredient = await this.prisma.ingredient.create({
      data,
      select: { id: true, en: true, uk: true },
    });
    const en = ingredient.en as IngredientJson;
    const uk = ingredient.uk as IngredientJson;
    return {
      id: ingredient.id,
      nameEn: en.name,
      nameUk: uk.name,
    };
  }
}
