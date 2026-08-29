-- AlterTable
ALTER TABLE "menus" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- DropIndex
DROP INDEX IF EXISTS "menus_ownerId_idx";

-- CreateIndex
CREATE INDEX "menus_ownerId_order_idx" ON "menus"("ownerId", "order");
