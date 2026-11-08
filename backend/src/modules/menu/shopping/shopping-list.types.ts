export type ShoppingLang = 'en' | 'uk';

export const SHOPPING_AISLES = [
  'produce',
  'dairy',
  'meat',
  'fish',
  'grains',
  'liquids',
  'baking',
  'spices',
  'other',
] as const;

export type ShoppingAisle = (typeof SHOPPING_AISLES)[number];

export type ShoppingIngredientLine = {
  ingredientId: string;
  nameEn: string;
  nameUk: string;
  quantity: number;
  unitCode: string;
  unitNameEn: string;
  unitNameUk: string;
  symbolEn: string | null;
  symbolUk: string | null;
  image: string | null;
};

export type ShoppingDishInput = {
  id: string;
  title: string;
  servings: number | null;
  lines: ShoppingIngredientLine[];
};

export type ShoppingListItem = {
  id: string;
  ingredientId: string;
  nameEn: string;
  nameUk: string;
  quantity: number;
  unitCode: string;
  unitNameEn: string;
  unitNameUk: string;
  symbolEn: string;
  symbolUk: string;
  image: string | null;
};

export type ShoppingListGroup = {
  id: ShoppingAisle;
  items: ShoppingListItem[];
};

export type ShoppingListDish = {
  id: string;
  title: string;
  servings: number | null;
};

export type ShoppingList = {
  menuId: string;
  name: string;
  occasion: string | null;
  dishesCount: number;
  itemsCount: number;
  servings: number | null;
  dishes: ShoppingListDish[];
  groups: ShoppingListGroup[];
};
