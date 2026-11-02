ALTER TABLE "dish-ingredient-groups" ADD COLUMN "name" TEXT;

UPDATE "dish-ingredient-groups"
SET "name" = COALESCE(
  NULLIF(BTRIM("nameUk"), ''),
  NULLIF(BTRIM("nameEn"), '')
);

ALTER TABLE "dish-ingredient-groups"
DROP COLUMN "nameEn",
DROP COLUMN "nameUk";
