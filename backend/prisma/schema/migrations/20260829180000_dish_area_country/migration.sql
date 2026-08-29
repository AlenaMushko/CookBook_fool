-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUk" TEXT NOT NULL,
    "flagSvg" TEXT NOT NULL,
    "flagAlt" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE INDEX "countries_nameEn_idx" ON "countries"("nameEn");

-- AlterTable
ALTER TABLE "dishes" ADD COLUMN "areaId" UUID;

-- CreateIndex
CREATE INDEX "dishes_areaId_idx" ON "dishes"("areaId");

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
