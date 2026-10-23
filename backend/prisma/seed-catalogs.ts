/**
 * Idempotent reference-data seed (countries, categories, units, ingredients, conversions).
 * Safe to re-run. Does not create demo users or recipes.
 *
 * Dev:  npx ts-node prisma/seed-catalogs.ts
 * Prod: node dist/prisma/seed-catalogs.js
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

import { COUNTRIES } from './data/countries';
import { MEASUREMENT_UNITS } from './data/measurement-units';
import { TAXONOMY } from './data/taxonomy';

export type CatalogSeedResult = {
  categoryIds: Map<string, string>;
  unitIds: Map<string, string>;
  ingredientIds: Map<string, string>;
};

interface IngredientJsonItem {
  en: { name: string; desc?: string };
  uk: { name: string; desc?: string };
  img?: string;
}

interface IngredientDensityItem {
  slug: string;
  name: { en: string; uk: string };
  category: string;
  grams_per_us_cup: number;
  aliases: string[];
}

const DENSITY_INGREDIENT_FALLBACKS: Record<string, string> = {
  'all-purpose-flour': 'Flour',
};

function applyIngredientPatches(item: IngredientJsonItem): IngredientJsonItem {
  const patched = {
    ...item,
    en: { ...item.en },
    uk: { ...item.uk },
  };

  if (patched.en.name === 'Suet' && patched.uk.name === 'Нирковий жир') {
    patched.uk.name = 'Яловичий жир (сало)';
  }

  patched.uk.desc = (patched.uk.desc ?? '')
    .replace(/бруккела/g, 'бруква')
    .replace(
      'також відома як зелена цибуля або цибуля-порей',
      'також відома як зелена цибуля',
    );

  return patched;
}

async function seedCountries(prisma: PrismaClient): Promise<void> {
  for (const country of COUNTRIES) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {
        nameEn: country.nameEn,
        nameUk: country.nameUk,
        flagSvg: country.flagSvg,
        flagAlt: country.flagAlt,
      },
      create: {
        code: country.code,
        nameEn: country.nameEn,
        nameUk: country.nameUk,
        flagSvg: country.flagSvg,
        flagAlt: country.flagAlt,
      },
    });
  }
}

async function seedTaxonomy(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  const categoryIdBySlug = new Map<string, string>();

  for (let i = 0; i < TAXONOMY.length; i++) {
    const cat = TAXONOMY[i];
    const category = await prisma.dishCategory.upsert({
      where: { slug: cat.slug },
      update: {
        nameEn: cat.nameEn,
        nameUk: cat.nameUk,
        order: i,
      },
      create: {
        nameEn: cat.nameEn,
        nameUk: cat.nameUk,
        slug: cat.slug,
        order: i,
      },
    });
    categoryIdBySlug.set(cat.slug, category.id);

    for (let j = 0; j < cat.subcategories.length; j++) {
      const sub = cat.subcategories[j];
      await prisma.dishSubcategory.upsert({
        where: {
          categoryId_slug: { categoryId: category.id, slug: sub.slug },
        },
        update: {
          nameEn: sub.nameEn,
          nameUk: sub.nameUk,
          order: j,
        },
        create: {
          categoryId: category.id,
          nameEn: sub.nameEn,
          nameUk: sub.nameUk,
          slug: sub.slug,
          order: j,
        },
      });
    }
  }

  return categoryIdBySlug;
}

async function seedMeasurementUnits(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  const unitIdByCode = new Map<string, string>();

  for (const unit of MEASUREMENT_UNITS) {
    const created = await prisma.measurementUnit.upsert({
      where: { code: unit.code },
      update: {
        nameEn: unit.nameEn,
        nameUk: unit.nameUk,
        symbolEn: unit.symbolEn,
        symbolUk: unit.symbolUk,
        type: unit.type,
        order: unit.order,
        isActive: true,
      },
      create: {
        code: unit.code,
        nameEn: unit.nameEn,
        nameUk: unit.nameUk,
        symbolEn: unit.symbolEn,
        symbolUk: unit.symbolUk,
        type: unit.type,
        order: unit.order,
      },
    });
    unitIdByCode.set(unit.code, created.id);
  }

  return unitIdByCode;
}

async function seedIngredients(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  const ingredientIdByName = new Map<string, string>();
  const filePath = path.join(__dirname, 'data', 'ingredients.json');

  if (!fs.existsSync(filePath)) {
    console.warn(
      'Skip ingredients seed: missing prisma/data/ingredients.json',
    );
    return ingredientIdByName;
  }

  console.log('Seeding ingredients from ingredients.json...');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const items: IngredientJsonItem[] = JSON.parse(raw).map(
    applyIngredientPatches,
  );

  for (const item of items) {
    const existing = await prisma.ingredient.findFirst({
      where: {
        en: { path: ['name'], equals: item.en.name },
      },
    });

    if (existing) {
      await prisma.ingredient.update({
        where: { id: existing.id },
        data: {
          en: item.en,
          uk: item.uk,
          image: item.img ?? null,
        },
      });
      ingredientIdByName.set(item.en.name.toLowerCase(), existing.id);
      continue;
    }

    const created = await prisma.ingredient.create({
      data: {
        en: item.en,
        uk: item.uk,
        image: item.img ?? null,
      },
    });
    ingredientIdByName.set(item.en.name.toLowerCase(), created.id);
  }

  return ingredientIdByName;
}

async function resolveIngredientForDensity(
  prisma: PrismaClient,
  item: IngredientDensityItem,
  ingredientIds: Map<string, string>,
): Promise<string> {
  const lookupNames = [
    item.name.en,
    DENSITY_INGREDIENT_FALLBACKS[item.slug],
    ...item.aliases,
  ].filter((name): name is string => Boolean(name));

  for (const name of lookupNames) {
    const cachedId = ingredientIds.get(name.toLowerCase());
    if (cachedId) {
      return cachedId;
    }
  }

  for (const name of lookupNames) {
    const existing = await prisma.ingredient.findFirst({
      where: { en: { path: ['name'], equals: name } },
    });
    if (existing) {
      ingredientIds.set(name.toLowerCase(), existing.id);
      return existing.id;
    }
  }

  const created = await prisma.ingredient.create({
    data: {
      en: { name: item.name.en },
      uk: { name: item.name.uk },
    },
  });
  ingredientIds.set(item.name.en.toLowerCase(), created.id);
  return created.id;
}

async function seedConversionRules(
  prisma: PrismaClient,
  ingredientIds: Map<string, string>,
  unitIds: Map<string, string>,
): Promise<void> {
  const filePath = path.join(
    __dirname,
    'data',
    'ingredient-density-uk-en.json',
  );

  if (!fs.existsSync(filePath)) {
    console.warn(
      'Skip conversion rules seed: missing prisma/data/ingredient-density-uk-en.json',
    );
    return;
  }

  const cupId = unitIds.get('cup');
  const gId = unitIds.get('g');
  if (!cupId || !gId) {
    console.warn('Skip conversion rules seed: cup or g unit missing');
    return;
  }

  console.log('Seeding conversion rules from ingredient-density-uk-en.json...');
  const items: IngredientDensityItem[] = JSON.parse(
    fs.readFileSync(filePath, 'utf-8'),
  );

  let upserted = 0;
  for (const item of items) {
    const ingredientId = await resolveIngredientForDensity(
      prisma,
      item,
      ingredientIds,
    );
    const existing = await prisma.conversionRule.findFirst({
      where: {
        ingredientId,
        fromUnitId: cupId,
        toUnitId: gId,
      },
    });

    if (existing) {
      await prisma.conversionRule.update({
        where: { id: existing.id },
        data: { factor: item.grams_per_us_cup },
      });
    } else {
      await prisma.conversionRule.create({
        data: {
          ingredientId,
          fromUnitId: cupId,
          toUnitId: gId,
          factor: item.grams_per_us_cup,
        },
      });
    }

    upserted++;
  }

  console.log(`Conversion rules upserted: ${upserted}`);
}

export async function seedCatalogs(
  prisma: PrismaClient,
): Promise<CatalogSeedResult> {
  console.log('Seeding countries...');
  await seedCountries(prisma);

  console.log('Seeding taxonomy...');
  const categoryIds = await seedTaxonomy(prisma);

  console.log('Seeding measurement units...');
  const unitIds = await seedMeasurementUnits(prisma);

  console.log('Seeding ingredients...');
  const ingredientIds = await seedIngredients(prisma);

  console.log('Seeding conversion rules...');
  await seedConversionRules(prisma, ingredientIds, unitIds);

  return { categoryIds, unitIds, ingredientIds };
}

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedCatalogs(prisma);
    console.log('Catalog seed completed.');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
}
