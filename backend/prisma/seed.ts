import { ContentLocale, PrismaClient, DishDifficulty, DishVisibility } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

import { MEASUREMENT_UNITS } from './data/measurement-units';
import { COUNTRIES } from './data/countries';
import { TAXONOMY } from './data/taxonomy';

const prisma = new PrismaClient();

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

/** Maps density slugs to ingredient names in ingredients.json when they differ. */
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

async function seedCountries(): Promise<void> {
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

async function seedTaxonomy(): Promise<Map<string, string>> {
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

async function seedMeasurementUnits(): Promise<Map<string, string>> {
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

async function seedIngredients(): Promise<Map<string, string>> {
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
  const items: IngredientJsonItem[] = JSON.parse(raw).map(applyIngredientPatches);

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
  ingredientIds: Map<string, string>,
  unitIds: Map<string, string>,
): Promise<void> {
  const filePath = path.join(__dirname, 'data', 'ingredient-density-uk-en.json');

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
    const ingredientId = await resolveIngredientForDensity(item, ingredientIds);
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

async function seedDemoData(
  categoryIds: Map<string, string>,
  unitIds: Map<string, string>,
  ingredientIds: Map<string, string>,
): Promise<void> {
  const password = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cookbook.local' },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'Chef',
      email: 'demo@cookbook.local',
      password,
    },
  });

  const soupsCategoryId = categoryIds.get('soups');
  const dessertsCategoryId = categoryIds.get('desserts');
  if (!soupsCategoryId || !dessertsCategoryId) return;

  const vegetableSoupSub = await prisma.dishSubcategory.findFirst({
    where: { categoryId: soupsCategoryId, slug: 'vegetable-soups' },
  });
  const cakesSub = await prisma.dishSubcategory.findFirst({
    where: { categoryId: dessertsCategoryId, slug: 'cakes' },
  });

  const gUnitId = unitIds.get('g')!;
  const mlUnitId = unitIds.get('ml')!;
  const pcsUnitId = unitIds.get('pcs')!;

  const beetId = ingredientIds.get('beetroot') ?? ingredientIds.get('beet');
  const cabbageId = ingredientIds.get('cabbage');
  const potatoId = ingredientIds.get('potato');
  const flourId = ingredientIds.get('flour');
  const honeyId = ingredientIds.get('honey');

  const borscht = await prisma.dish.create({
    data: {
      locale: ContentLocale.UK,
      titleUk: 'Борщ',
      descriptionUk: 'Класичний український буряковий суп',
      visibility: DishVisibility.PUBLIC,
      difficulty: DishDifficulty.MEDIUM,
      prepTime: 30,
      cookTime: 90,
      baseServings: 6,
      steps: [
        {
          order: 1,
          instructionUk: 'Очистіть та наріжте овочі.',
          photoKey: null,
        },
        {
          order: 2,
          instructionUk: 'Варіть буряк та капусту в бульйоні.',
          photoKey: null,
        },
      ],
      photos: [],
      ownerId: demoUser.id,
      categoryId: soupsCategoryId,
      subcategoryId: vegetableSoupSub?.id,
    },
  });

  if (beetId && cabbageId && potatoId) {
    await prisma.dishIngredient.createMany({
      data: [
        { dishId: borscht.id, ingredientId: beetId, unitId: gUnitId, quantity: 300, order: 0 },
        { dishId: borscht.id, ingredientId: cabbageId, unitId: gUnitId, quantity: 200, order: 1 },
        { dishId: borscht.id, ingredientId: potatoId, unitId: gUnitId, quantity: 250, order: 2 },
      ],
    });
  }

  const honeyCake = await prisma.dish.create({
    data: {
      locale: ContentLocale.UK,
      titleUk: 'Медовик',
      descriptionUk: 'Шаруватий медовий торт',
      visibility: DishVisibility.PUBLIC,
      difficulty: DishDifficulty.HARD,
      prepTime: 60,
      cookTime: 45,
      baseServings: 8,
      steps: [
        {
          order: 1,
          instructionUk: 'Змішайте мед з борошном та яйцями.',
          photoKey: null,
        },
      ],
      photos: [],
      ownerId: demoUser.id,
      categoryId: dessertsCategoryId,
      subcategoryId: cakesSub?.id,
    },
  });

  if (flourId && honeyId) {
    await prisma.dishIngredient.createMany({
      data: [
        { dishId: honeyCake.id, ingredientId: flourId, unitId: gUnitId, quantity: 400, order: 0 },
        { dishId: honeyCake.id, ingredientId: honeyId, unitId: mlUnitId, quantity: 150, order: 1 },
      ],
    });
  }

  const chicken = await prisma.dish.create({
    data: {
      locale: ContentLocale.EN,
      titleEn: 'Herb Roast Chicken',
      descriptionEn: 'Roasted chicken with herbs',
      visibility: DishVisibility.PUBLIC,
      difficulty: DishDifficulty.EASY,
      prepTime: 15,
      cookTime: 75,
      baseServings: 4,
      steps: [
        {
          order: 1,
          instructionEn: 'Season chicken and roast at 180°C.',
          photoKey: null,
        },
      ],
      photos: [],
      ownerId: demoUser.id,
      categoryId: categoryIds.get('main-dishes')!,
    },
  });

  if (pcsUnitId) {
    const chickenIng = ingredientIds.get('chicken');
    if (chickenIng) {
      await prisma.dishIngredient.create({
        data: {
          dishId: chicken.id,
          ingredientId: chickenIng,
          unitId: pcsUnitId,
          quantity: 1,
          order: 0,
        },
      });
    }
  }

  const menu = await prisma.menu.create({
    data: {
      ownerId: demoUser.id,
      name: 'Weekend Menu',
      description: 'Demo menu with sections',
    },
  });

  const starters = await prisma.menuSection.create({
    data: { menuId: menu.id, name: 'Starters', order: 0 },
  });

  const mains = await prisma.menuSection.create({
    data: { menuId: menu.id, name: 'Main', order: 1 },
  });

  await prisma.menuDish.createMany({
    data: [
      { menuId: menu.id, dishId: borscht.id, sectionId: starters.id, order: 0 },
      { menuId: menu.id, dishId: chicken.id, sectionId: mains.id, order: 0 },
      { menuId: menu.id, dishId: honeyCake.id, sectionId: mains.id, order: 1 },
    ],
  });

  const cookbookUser = await prisma.user.upsert({
    where: { email: 'cook@cookbook.local' },
    update: {},
    create: {
      firstName: 'Cookbook',
      lastName: 'Fan',
      email: 'cook@cookbook.local',
      password,
    },
  });

  await prisma.like.createMany({
    data: [
      { userId: cookbookUser.id, dishId: borscht.id },
      { userId: cookbookUser.id, dishId: honeyCake.id },
    ],
    skipDuplicates: true,
  });
}

async function main(): Promise<void> {
  console.log('Seeding countries...');
  await seedCountries();

  console.log('Seeding taxonomy...');
  const categoryIds = await seedTaxonomy();

  console.log('Seeding measurement units...');
  const unitIds = await seedMeasurementUnits();

  console.log('Seeding ingredients...');
  const ingredientIds = await seedIngredients();

  console.log('Seeding conversion rules...');
  await seedConversionRules(ingredientIds, unitIds);

  console.log('Seeding demo data...');
  const dishCount = await prisma.dish.count();
  if (dishCount === 0) {
    await seedDemoData(categoryIds, unitIds, ingredientIds);
  }

  console.log('Seed completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
