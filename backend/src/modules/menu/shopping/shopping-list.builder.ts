import { shoppingAisleOf } from './shopping-aisles';
import {
  SHOPPING_AISLES,
  ShoppingAisle,
  ShoppingDishInput,
  ShoppingIngredientLine,
  ShoppingList,
  ShoppingListItem,
} from './shopping-list.types';

const TABLESPOONS_PER_CUP = 16;
const TEASPOONS_PER_CUP = 48;

const GRAM = {
  unitCode: 'g',
  unitNameEn: 'gram',
  unitNameUk: 'грам',
  symbolEn: 'g',
  symbolUk: 'г',
};

const MILLILITRE = {
  unitCode: 'ml',
  unitNameEn: 'millilitre',
  unitNameUk: 'мілілітр',
  symbolEn: 'ml',
  symbolUk: 'мл',
};

export const formatShoppingQuantity = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
};

const roundQuantity = (value: number) => Math.round(value * 1000) / 1000;

const sumLines = (lines: ShoppingIngredientLine[]) =>
  roundQuantity(lines.reduce((total, line) => total + line.quantity, 0));

const toGrams = (
  line: ShoppingIngredientLine,
  gramsPerCup: Map<string, number>,
) => {
  if (line.unitCode === 'g') return line.quantity;
  if (line.unitCode === 'kg') return line.quantity * 1000;
  const perCup = gramsPerCup.get(line.ingredientId);
  if (perCup == null) return null;
  if (line.unitCode === 'cup') return line.quantity * perCup;
  if (line.unitCode === 'tbsp')
    return (line.quantity * perCup) / TABLESPOONS_PER_CUP;
  if (line.unitCode === 'tsp')
    return (line.quantity * perCup) / TEASPOONS_PER_CUP;
  return null;
};

const toMillilitres = (line: ShoppingIngredientLine) => {
  if (line.unitCode === 'ml') return line.quantity;
  if (line.unitCode === 'l') return line.quantity * 1000;
  return null;
};

const itemFrom = (
  line: ShoppingIngredientLine,
  quantity: number,
): ShoppingListItem => ({
  id: `${line.ingredientId}:${line.unitCode}`,
  ingredientId: line.ingredientId,
  nameEn: line.nameEn,
  nameUk: line.nameUk,
  quantity,
  unitCode: line.unitCode,
  unitNameEn: line.unitNameEn,
  unitNameUk: line.unitNameUk,
  symbolEn: line.symbolEn || line.unitCode,
  symbolUk: line.symbolUk || line.unitCode,
  image: line.image,
});

const withImage = (
  item: ShoppingListItem,
  lines: ShoppingIngredientLine[],
): ShoppingListItem => ({
  ...item,
  image: lines.find((line) => line.image)?.image ?? null,
});

const mergeIngredient = (
  lines: ShoppingIngredientLine[],
  gramsPerCup: Map<string, number>,
) => {
  const first = lines[0];
  if (!first) return [];
  const unitCodes = new Set(lines.map((line) => line.unitCode));
  if (unitCodes.size === 1) {
    return [withImage(itemFrom(first, sumLines(lines)), lines)];
  }

  const grams = lines.map((line) => toGrams(line, gramsPerCup));
  if (grams.every((value): value is number => value != null)) {
    return [
      {
        ...itemFrom(
          first,
          roundQuantity(grams.reduce((total, value) => total + value, 0)),
        ),
        id: `${first.ingredientId}:g`,
        ...GRAM,
        image: lines.find((line) => line.image)?.image ?? null,
      },
    ];
  }

  const millilitres = lines.map((line) => toMillilitres(line));
  if (millilitres.every((value): value is number => value != null)) {
    return [
      {
        ...itemFrom(
          first,
          roundQuantity(millilitres.reduce((total, value) => total + value, 0)),
        ),
        id: `${first.ingredientId}:ml`,
        ...MILLILITRE,
        image: lines.find((line) => line.image)?.image ?? null,
      },
    ];
  }

  return [...unitCodes].flatMap((unitCode) => {
    const same = lines.filter((line) => line.unitCode === unitCode);
    const sample = same[0];
    return sample ? [withImage(itemFrom(sample, sumLines(same)), same)] : [];
  });
};

export const buildShoppingList = (
  menu: { id: string; name: string; occasion: string | null },
  dishes: ShoppingDishInput[],
  gramsPerCup: Map<string, number>,
): ShoppingList => {
  const byIngredient = new Map<string, ShoppingIngredientLine[]>();
  for (const dish of dishes) {
    for (const line of dish.lines) {
      const bucket = byIngredient.get(line.ingredientId) ?? [];
      bucket.push(line);
      byIngredient.set(line.ingredientId, bucket);
    }
  }

  const merged = [...byIngredient.values()].flatMap((lines) =>
    mergeIngredient(lines, gramsPerCup),
  );
  const grouped = new Map<ShoppingAisle, ShoppingListItem[]>();
  for (const item of merged) {
    const aisle = shoppingAisleOf(item.nameEn, item.nameUk);
    const bucket = grouped.get(aisle) ?? [];
    bucket.push(item);
    grouped.set(aisle, bucket);
  }

  const groups = SHOPPING_AISLES.flatMap((id) => {
    const items = grouped.get(id);
    if (!items?.length) return [];
    items.sort((left, right) => left.nameEn.localeCompare(right.nameEn));
    return [{ id, items }];
  });

  const servings = dishes.map((dish) => dish.servings);
  const defined = servings.filter((value): value is number => value != null);
  const sameServings =
    defined.length === dishes.length &&
    defined.length > 0 &&
    defined.every((value) => value === defined[0]);

  return {
    menuId: menu.id,
    name: menu.name,
    occasion: menu.occasion,
    dishesCount: dishes.length,
    itemsCount: merged.length,
    servings: sameServings ? defined[0] : null,
    dishes: dishes.map((dish) => ({
      id: dish.id,
      title: dish.title,
      servings: dish.servings,
    })),
    groups,
  };
};
