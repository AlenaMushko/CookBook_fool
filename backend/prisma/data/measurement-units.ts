import { MeasurementUnitType } from '@prisma/client';

export interface MeasurementUnitSeed {
  code: string;
  nameEn: string;
  nameUk: string;
  symbolEn?: string;
  symbolUk?: string;
  type: MeasurementUnitType;
  order: number;
}

export const MEASUREMENT_UNITS: MeasurementUnitSeed[] = [
  { code: 'g', nameEn: 'gram', nameUk: 'грам', symbolEn: 'g', symbolUk: 'г', type: 'MASS', order: 0 },
  { code: 'kg', nameEn: 'kilogram', nameUk: 'кілограм', symbolEn: 'kg', symbolUk: 'кг', type: 'MASS', order: 1 },
  { code: 'ml', nameEn: 'millilitre', nameUk: 'мілілітр', symbolEn: 'ml', symbolUk: 'мл', type: 'VOLUME', order: 2 },
  { code: 'l', nameEn: 'litre', nameUk: 'літр', symbolEn: 'l', symbolUk: 'л', type: 'VOLUME', order: 3 },
  { code: 'pcs', nameEn: 'piece', nameUk: 'штука', symbolEn: 'pcs', symbolUk: 'шт', type: 'COUNT', order: 4 },
  { code: 'tsp', nameEn: 'teaspoon', nameUk: 'чайна ложка', symbolEn: 'tsp', symbolUk: 'ч.л.', type: 'VOLUME', order: 5 },
  { code: 'tbsp', nameEn: 'tablespoon', nameUk: 'столова ложка', symbolEn: 'tbsp', symbolUk: 'ст.л.', type: 'VOLUME', order: 6 },
  { code: 'cup', nameEn: 'cup', nameUk: 'склянка', symbolEn: 'cup', symbolUk: 'скл', type: 'VOLUME', order: 7 },
];
