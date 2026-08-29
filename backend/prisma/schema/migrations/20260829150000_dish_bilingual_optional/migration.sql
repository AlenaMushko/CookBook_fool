-- AlterTable dishes: restore bilingual optional fields from single-locale columns
ALTER TABLE "dishes"
  ADD COLUMN "titleEn" TEXT,
  ADD COLUMN "titleUk" TEXT,
  ADD COLUMN "descriptionEn" TEXT,
  ADD COLUMN "descriptionUk" TEXT,
  ADD COLUMN "noteEn" TEXT,
  ADD COLUMN "noteUk" TEXT;

UPDATE "dishes"
SET
  "titleUk" = CASE WHEN "locale" = 'UK' THEN "title" ELSE NULL END,
  "titleEn" = CASE WHEN "locale" = 'EN' THEN "title" ELSE NULL END,
  "descriptionUk" = CASE WHEN "locale" = 'UK' THEN "description" ELSE NULL END,
  "descriptionEn" = CASE WHEN "locale" = 'EN' THEN "description" ELSE NULL END,
  "noteUk" = CASE WHEN "locale" = 'UK' THEN "note" ELSE NULL END,
  "noteEn" = CASE WHEN "locale" = 'EN' THEN "note" ELSE NULL END,
  "steps" = (
    SELECT COALESCE(
      jsonb_agg(
        CASE
          WHEN "dishes"."locale" = 'UK' THEN
            jsonb_build_object(
              'order', (step->>'order')::int,
              'instructionUk', step->>'instruction',
              'instructionEn', NULL,
              'photoKey', step->'photoKey'
            )
          ELSE
            jsonb_build_object(
              'order', (step->>'order')::int,
              'instructionEn', step->>'instruction',
              'instructionUk', NULL,
              'photoKey', step->'photoKey'
            )
        END
        ORDER BY (step->>'order')::int
      ),
      '[]'::jsonb
    )
    FROM jsonb_array_elements(COALESCE("steps", '[]'::jsonb)) AS step
  );

ALTER TABLE "dishes"
  DROP COLUMN "title",
  DROP COLUMN "description",
  DROP COLUMN "note";

ALTER TABLE "dishes"
  ADD CONSTRAINT "dishes_title_at_least_one"
  CHECK ("titleEn" IS NOT NULL OR "titleUk" IS NOT NULL);

-- AlterTable dish-ingredient-groups
ALTER TABLE "dish-ingredient-groups"
  ADD COLUMN "nameEn" TEXT,
  ADD COLUMN "nameUk" TEXT;

UPDATE "dish-ingredient-groups" AS g
SET
  "nameUk" = CASE WHEN d."locale" = 'UK' THEN g."name" ELSE NULL END,
  "nameEn" = CASE WHEN d."locale" = 'EN' THEN g."name" ELSE NULL END
FROM "dishes" AS d
WHERE d."id" = g."dishId";

-- orphan groups without dish (shouldn't exist): keep name in nameUk
UPDATE "dish-ingredient-groups"
SET "nameUk" = "name"
WHERE "nameEn" IS NULL AND "nameUk" IS NULL AND "name" IS NOT NULL;

ALTER TABLE "dish-ingredient-groups" DROP COLUMN "name";

ALTER TABLE "dish-ingredient-groups"
  ADD CONSTRAINT "dish_ingredient_groups_name_at_least_one"
  CHECK ("nameEn" IS NOT NULL OR "nameUk" IS NOT NULL);
