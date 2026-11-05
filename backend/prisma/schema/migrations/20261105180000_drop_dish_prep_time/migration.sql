-- Keep the minutes that lived only in prepTime, and keep the total the cards already showed.
UPDATE "dishes"
SET "cookTime" = COALESCE("cookTime", 0) + "prepTime"
WHERE "prepTime" IS NOT NULL;

ALTER TABLE "dishes" DROP COLUMN "prepTime";
