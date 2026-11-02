ALTER TABLE "dishes" ADD COLUMN "title" TEXT;
ALTER TABLE "dishes" ADD COLUMN "description" TEXT;

UPDATE "dishes"
SET
  "title" = COALESCE(
    NULLIF(BTRIM("titleUk"), ''),
    NULLIF(BTRIM("titleEn"), ''),
    ''
  ),
  "description" = COALESCE(
    NULLIF(BTRIM("descriptionUk"), ''),
    NULLIF(BTRIM("descriptionEn"), '')
  );

ALTER TABLE "dishes" ALTER COLUMN "title" SET NOT NULL;

ALTER TABLE "dishes"
DROP COLUMN "titleEn",
DROP COLUMN "titleUk",
DROP COLUMN "descriptionEn",
DROP COLUMN "descriptionUk";

UPDATE "dishes"
SET "steps" = COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_strip_nulls(
        jsonb_build_object(
          'order', step -> 'order',
          'title', NULLIF(
            BTRIM(
              COALESCE(
                step ->> 'title',
                step ->> 'titleUk',
                step ->> 'titleEn',
                ''
              )
            ),
            ''
          ),
          'description', NULLIF(
            BTRIM(
              COALESCE(
                step ->> 'description',
                step ->> 'instructionUk',
                step ->> 'instructionEn',
                ''
              )
            ),
            ''
          ),
          'photoKey', CASE
            WHEN jsonb_typeof(step -> 'photoKey') = 'string' THEN step -> 'photoKey'
            ELSE NULL
          END
        )
      )
      ORDER BY (step ->> 'order')::int
    )
    FROM jsonb_array_elements("steps") AS step
  ),
  '[]'::jsonb
);
