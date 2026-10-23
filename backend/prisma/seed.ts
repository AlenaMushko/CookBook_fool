/**
 * Local/dev seed entry.
 * Always seeds catalogs (idempotent). Demo users/recipes only when SEED_DEMO=true.
 *
 * Production / EB: use `node dist/prisma/seed-catalogs.js` (no demos).
 */
import {
  ContentLocale,
  DishDifficulty,
  DishVisibility,
  PrismaClient,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { seedCatalogs } from './seed-catalogs';

const prisma = new PrismaClient();

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

  const existingDemoDish = await prisma.dish.findFirst({
    where: { ownerId: demoUser.id, titleUk: 'Борщ' },
  });
  if (existingDemoDish) {
    console.log('Demo dishes already present — skipping demo seed.');
    return;
  }

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
        {
          dishId: borscht.id,
          ingredientId: beetId,
          unitId: gUnitId,
          quantity: 300,
          order: 0,
        },
        {
          dishId: borscht.id,
          ingredientId: cabbageId,
          unitId: gUnitId,
          quantity: 200,
          order: 1,
        },
        {
          dishId: borscht.id,
          ingredientId: potatoId,
          unitId: gUnitId,
          quantity: 250,
          order: 2,
        },
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
        {
          dishId: honeyCake.id,
          ingredientId: flourId,
          unitId: gUnitId,
          quantity: 400,
          order: 0,
        },
        {
          dishId: honeyCake.id,
          ingredientId: honeyId,
          unitId: mlUnitId,
          quantity: 150,
          order: 1,
        },
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
  const { categoryIds, unitIds, ingredientIds } = await seedCatalogs(prisma);

  if (process.env.SEED_DEMO === 'true') {
    console.log('Seeding demo data (SEED_DEMO=true)...');
    await seedDemoData(categoryIds, unitIds, ingredientIds);
  } else {
    console.log('Skipping demo users/recipes (set SEED_DEMO=true to enable).');
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
