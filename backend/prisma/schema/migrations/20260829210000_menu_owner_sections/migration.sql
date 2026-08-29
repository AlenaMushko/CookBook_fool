-- menus: userId -> ownerId
ALTER TABLE "menus" RENAME COLUMN "userId" TO "ownerId";
ALTER INDEX "menus_userId_idx" RENAME TO "menus_ownerId_idx";
ALTER TABLE "menus" RENAME CONSTRAINT "menus_userId_fkey" TO "menus_ownerId_fkey";

-- menu-categories -> menu-sections
ALTER TABLE "menu-categories" RENAME TO "menu-sections";
ALTER INDEX "menu-categories_pkey" RENAME TO "menu-sections_pkey";
ALTER INDEX IF EXISTS "menu-categories_menuId_idx" RENAME TO "menu-sections_menuId_idx";
ALTER INDEX "menu-categories_menuId_order_idx" RENAME TO "menu-sections_menuId_order_idx";
ALTER INDEX "menu-categories_menuId_name_key" RENAME TO "menu-sections_menuId_name_key";
ALTER TABLE "menu-sections" RENAME CONSTRAINT "menu-categories_menuId_fkey" TO "menu-sections_menuId_fkey";

-- menu-items -> menu-dishes, categoryId -> sectionId
ALTER TABLE "menu-items" RENAME COLUMN "categoryId" TO "sectionId";
ALTER TABLE "menu-items" RENAME CONSTRAINT "menu-items_categoryId_fkey" TO "menu-items_sectionId_fkey";
ALTER TABLE "menu-items" RENAME TO "menu-dishes";
ALTER INDEX "menu-items_pkey" RENAME TO "menu-dishes_pkey";
ALTER INDEX "menu-items_menuId_dishId_key" RENAME TO "menu-dishes_menuId_dishId_key";
ALTER INDEX "menu-items_menuId_categoryId_order_idx" RENAME TO "menu-dishes_menuId_sectionId_order_idx";
ALTER TABLE "menu-dishes" RENAME CONSTRAINT "menu-items_menuId_fkey" TO "menu-dishes_menuId_fkey";
ALTER TABLE "menu-dishes" RENAME CONSTRAINT "menu-items_dishId_fkey" TO "menu-dishes_dishId_fkey";
ALTER TABLE "menu-dishes" RENAME CONSTRAINT "menu-items_sectionId_fkey" TO "menu-dishes_sectionId_fkey";
