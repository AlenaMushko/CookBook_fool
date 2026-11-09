-- The unit type was removed from the Prisma model, but the column stayed
-- NOT NULL and without a default. Inserts from the catalog seed omit it.
ALTER TABLE "measurement-units" DROP COLUMN "type";

DROP TYPE "MeasurementUnitType";
