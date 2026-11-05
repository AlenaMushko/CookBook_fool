export interface MeasurementUnitSeed {
  code: string;
  nameEn: string;
  nameUk: string;
  symbolEn?: string;
  symbolUk?: string;
  order: number;
}

export const MEASUREMENT_UNITS: MeasurementUnitSeed[] = [
  { code: 'g', nameEn: 'gram', nameUk: 'грам', symbolEn: 'g', symbolUk: 'г', order: 0 },
  { code: 'kg', nameEn: 'kilogram', nameUk: 'кілограм', symbolEn: 'kg', symbolUk: 'кг', order: 1 },
  { code: 'ml', nameEn: 'millilitre', nameUk: 'мілілітр', symbolEn: 'ml', symbolUk: 'мл', order: 2 },
  { code: 'l', nameEn: 'litre', nameUk: 'літр', symbolEn: 'l', symbolUk: 'л', order: 3 },
  { code: 'pcs', nameEn: 'piece', nameUk: 'штука', symbolEn: 'pcs', symbolUk: 'шт', order: 4 },
  { code: 'tsp', nameEn: 'teaspoon', nameUk: 'чайна ложка', symbolEn: 'tsp', symbolUk: 'ч.л.', order: 5 },
  { code: 'tbsp', nameEn: 'tablespoon', nameUk: 'столова ложка', symbolEn: 'tbsp', symbolUk: 'ст.л.', order: 6 },
  { code: 'cup', nameEn: 'cup', nameUk: 'склянка', symbolEn: 'cup', symbolUk: 'скл', order: 7 },
];
