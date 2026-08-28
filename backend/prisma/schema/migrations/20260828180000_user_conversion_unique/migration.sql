-- Make ingredientId required and enforce one personal rule per user/ingredient/unit pair
DELETE FROM "user-conversion-rules" WHERE "ingredientId" IS NULL;

ALTER TABLE "user-conversion-rules" ALTER COLUMN "ingredientId" SET NOT NULL;

CREATE UNIQUE INDEX "user-conversion-rules_userId_ingredientId_fromUnitId_toUnitId_key"
ON "user-conversion-rules"("userId", "ingredientId", "fromUnitId", "toUnitId");
