-- CreateEnum
CREATE TYPE "ContentLocale" AS ENUM ('UK', 'EN');

-- AlterTable dishes: add new columns
ALTER TABLE "dishes"
  ADD COLUMN "locale" "ContentLocale",
  ADD COLUMN "title" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "note" TEXT;

-- Migrate existing dish content (prefer UK, fallback EN)
UPDATE "dishes"
SET
  "locale" = 'UK',
  "title" = COALESCE(NULLIF(TRIM("titleUk"), ''), NULLIF(TRIM("titleEn"), ''), 'Untitled'),
  "description" = COALESCE(NULLIF(TRIM("descriptionUk"), ''), NULLIF(TRIM("descriptionEn"), '')),
  "note" = COALESCE(NULLIF(TRIM("noteUk"), ''), NULLIF(TRIM("noteEn"), '')),
  "steps" = (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'order', step->>'order',
          'instruction', COALESCE(
            NULLIF(TRIM(step->>'instructionUk'), ''),
            NULLIF(TRIM(step->>'instructionEn'), ''),
            ''
          ),
          'photoKey', step->'photoKey'
        )
        ORDER BY (step->>'order')::int
      ),
      '[]'::jsonb
    )
    FROM jsonb_array_elements(COALESCE("steps", '[]'::jsonb)) AS step
  );

ALTER TABLE "dishes"
  ALTER COLUMN "locale" SET NOT NULL,
  ALTER COLUMN "title" SET NOT NULL;

ALTER TABLE "dishes"
  DROP COLUMN "titleEn",
  DROP COLUMN "titleUk",
  DROP COLUMN "descriptionEn",
  DROP COLUMN "descriptionUk",
  DROP COLUMN "noteEn",
  DROP COLUMN "noteUk";

CREATE INDEX "dishes_locale_idx" ON "dishes"("locale");

-- AlterTable dish-ingredient-groups
ALTER TABLE "dish-ingredient-groups" ADD COLUMN "name" TEXT;

UPDATE "dish-ingredient-groups"
SET "name" = COALESCE(NULLIF(TRIM("nameUk"), ''), NULLIF(TRIM("nameEn"), ''), 'Group');

ALTER TABLE "dish-ingredient-groups" ALTER COLUMN "name" SET NOT NULL;

ALTER TABLE "dish-ingredient-groups"
  DROP COLUMN "nameEn",
  DROP COLUMN "nameUk";
