-- Drop old tables (dev migration — data will be re-seeded)
DROP TABLE IF EXISTS "likes" CASCADE;
DROP TABLE IF EXISTS "dishes" CASCADE;
DROP TABLE IF EXISTS "dish-categories" CASCADE;

-- CreateEnum
CREATE TYPE "DishVisibility" AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE "DishDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "MeasurementUnitType" AS ENUM ('MASS', 'VOLUME', 'COUNT');

-- CreateTable password-reset-tokens
CREATE TABLE "password-reset-tokens" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "tokenHash" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    CONSTRAINT "password-reset-tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable user-conversion-rules
CREATE TABLE "user-conversion-rules" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "ingredientId" UUID,
    "fromUnitId" UUID NOT NULL,
    "toUnitId" UUID NOT NULL,
    "factor" DECIMAL(12,6) NOT NULL,
    CONSTRAINT "user-conversion-rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable dish-categories (new structure)
CREATE TABLE "dish-categories" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUk" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "dish-categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable dish-subcategories
CREATE TABLE "dish-subcategories" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUk" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "dish-subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable ingredients
CREATE TABLE "ingredients" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "en" JSONB NOT NULL,
    "uk" JSONB NOT NULL,
    "image" TEXT,
    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable measurement-units
CREATE TABLE "measurement-units" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUk" TEXT NOT NULL,
    "symbolEn" TEXT,
    "symbolUk" TEXT,
    "type" "MeasurementUnitType" NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "measurement-units_pkey" PRIMARY KEY ("id")
);

-- CreateTable dish-ingredient-groups
CREATE TABLE "dish-ingredient-groups" (
    "id" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUk" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "dish-ingredient-groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable dish-ingredients
CREATE TABLE "dish-ingredients" (
    "id" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "ingredientId" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "groupId" UUID,
    "quantity" DECIMAL(10,3) NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "dish-ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable conversion-rules
CREATE TABLE "conversion-rules" (
    "id" UUID NOT NULL,
    "ingredientId" UUID,
    "fromUnitId" UUID NOT NULL,
    "toUnitId" UUID NOT NULL,
    "factor" DECIMAL(12,6) NOT NULL,
    CONSTRAINT "conversion-rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable dishes (new structure)
CREATE TABLE "dishes" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleUk" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionUk" TEXT,
    "noteEn" TEXT,
    "noteUk" TEXT,
    "visibility" "DishVisibility" NOT NULL,
    "difficulty" "DishDifficulty" NOT NULL,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "baseServings" DECIMAL(5,1),
    "steps" JSONB NOT NULL,
    "photos" JSONB,
    "ownerId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "subcategoryId" UUID,
    "originalDishId" UUID,
    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable likes (new structure)
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dishId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable menus
CREATE TABLE "menus" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable menu-sections
CREATE TABLE "menu-sections" (
    "id" UUID NOT NULL,
    "menuId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "menu-sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable menu-dishes
CREATE TABLE "menu-dishes" (
    "id" UUID NOT NULL,
    "menuId" UUID NOT NULL,
    "dishId" UUID NOT NULL,
    "sectionId" UUID,
    "order" INTEGER NOT NULL,
    CONSTRAINT "menu-dishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password-reset-tokens_tokenHash_key" ON "password-reset-tokens"("tokenHash");
CREATE INDEX "password-reset-tokens_userId_idx" ON "password-reset-tokens"("userId");
CREATE UNIQUE INDEX "dish-categories_slug_key" ON "dish-categories"("slug");
CREATE INDEX "dish-subcategories_categoryId_idx" ON "dish-subcategories"("categoryId");
CREATE UNIQUE INDEX "dish-subcategories_categoryId_slug_key" ON "dish-subcategories"("categoryId", "slug");
CREATE UNIQUE INDEX "measurement-units_code_key" ON "measurement-units"("code");
CREATE INDEX "dish-ingredient-groups_dishId_idx" ON "dish-ingredient-groups"("dishId");
CREATE INDEX "dish-ingredients_dishId_idx" ON "dish-ingredients"("dishId");
CREATE INDEX "dish-ingredients_ingredientId_idx" ON "dish-ingredients"("ingredientId");
CREATE INDEX "dish-ingredients_unitId_idx" ON "dish-ingredients"("unitId");
CREATE INDEX "dishes_ownerId_idx" ON "dishes"("ownerId");
CREATE INDEX "dishes_categoryId_idx" ON "dishes"("categoryId");
CREATE INDEX "dishes_subcategoryId_idx" ON "dishes"("subcategoryId");
CREATE INDEX "dishes_visibility_idx" ON "dishes"("visibility");
CREATE INDEX "dishes_created_idx" ON "dishes"("created");
CREATE UNIQUE INDEX "likes_dishId_userId_key" ON "likes"("dishId", "userId");
CREATE INDEX "likes_userId_idx" ON "likes"("userId");
CREATE INDEX "likes_dishId_idx" ON "likes"("dishId");
CREATE INDEX "menus_userId_idx" ON "menus"("userId");
CREATE INDEX "menu-sections_menuId_idx" ON "menu-sections"("menuId");
CREATE UNIQUE INDEX "menu-dishes_menuId_dishId_key" ON "menu-dishes"("menuId", "dishId");

-- AddForeignKey
ALTER TABLE "password-reset-tokens" ADD CONSTRAINT "password-reset-tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user-conversion-rules" ADD CONSTRAINT "user-conversion-rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user-conversion-rules" ADD CONSTRAINT "user-conversion-rules_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "dish-subcategories" ADD CONSTRAINT "dish-subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "dish-categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dish-ingredient-groups" ADD CONSTRAINT "dish-ingredient-groups_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dish-ingredients" ADD CONSTRAINT "dish-ingredients_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dish-ingredients" ADD CONSTRAINT "dish-ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dish-ingredients" ADD CONSTRAINT "dish-ingredients_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "measurement-units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dish-ingredients" ADD CONSTRAINT "dish-ingredients_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "dish-ingredient-groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "conversion-rules" ADD CONSTRAINT "conversion-rules_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "conversion-rules" ADD CONSTRAINT "conversion-rules_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "measurement-units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conversion-rules" ADD CONSTRAINT "conversion-rules_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "measurement-units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "dish-categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "dish-subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_originalDishId_fkey" FOREIGN KEY ("originalDishId") REFERENCES "dishes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menus" ADD CONSTRAINT "menus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu-sections" ADD CONSTRAINT "menu-sections_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu-dishes" ADD CONSTRAINT "menu-dishes_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu-dishes" ADD CONSTRAINT "menu-dishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu-dishes" ADD CONSTRAINT "menu-dishes_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "menu-sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
