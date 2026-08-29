-- AlterTable menus
ALTER TABLE "menus" ADD COLUMN "eventDate" TIMESTAMP(3);
ALTER TABLE "menus" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- Rename menu-sections -> menu-categories
ALTER TABLE "menu-sections" RENAME TO "menu-categories";
ALTER INDEX "menu-sections_pkey" RENAME TO "menu-categories_pkey";
ALTER INDEX "menu-sections_menuId_idx" RENAME TO "menu-categories_menuId_idx";
ALTER TABLE "menu-categories" RENAME CONSTRAINT "menu-sections_menuId_fkey" TO "menu-categories_menuId_fkey";

-- Rename FK column
ALTER TABLE "menu-dishes" RENAME COLUMN "sectionId" TO "categoryId";
ALTER TABLE "menu-dishes" RENAME CONSTRAINT "menu-dishes_sectionId_fkey" TO "menu-dishes_categoryId_fkey";

-- Rename menu-dishes -> menu-items
ALTER TABLE "menu-dishes" RENAME TO "menu-items";
ALTER INDEX "menu-dishes_pkey" RENAME TO "menu-items_pkey";
ALTER INDEX "menu-dishes_menuId_dishId_key" RENAME TO "menu-items_menuId_dishId_key";
ALTER TABLE "menu-items" RENAME CONSTRAINT "menu-dishes_menuId_fkey" TO "menu-items_menuId_fkey";
ALTER TABLE "menu-items" RENAME CONSTRAINT "menu-dishes_dishId_fkey" TO "menu-items_dishId_fkey";
ALTER TABLE "menu-items" RENAME CONSTRAINT "menu-dishes_categoryId_fkey" TO "menu-items_categoryId_fkey";

-- Menu item extras
ALTER TABLE "menu-items" ADD COLUMN "servings" INTEGER;
ALTER TABLE "menu-items" ADD COLUMN "note" TEXT;

-- Category uniqueness + indexes
CREATE UNIQUE INDEX "menu-categories_menuId_name_key" ON "menu-categories"("menuId", "name");
CREATE INDEX "menu-categories_menuId_order_idx" ON "menu-categories"("menuId", "order");
CREATE INDEX "menu-items_menuId_categoryId_order_idx" ON "menu-items"("menuId", "categoryId", "order");
