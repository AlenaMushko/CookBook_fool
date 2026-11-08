import { formatShoppingQuantity } from './shopping-list.builder';
import { ShoppingAisle, ShoppingLang } from './shopping-list.types';

type Forms = {
  one: string;
  few: string;
  many: string;
};

const phrase = (count: number, forms: Forms, lang: ShoppingLang) => {
  const amount = formatShoppingQuantity(count);
  const template = lang === 'en' ? enForm(count, forms) : ukForm(count, forms);
  return template.replace('{{count}}', amount);
};

const enForm = (count: number, forms: Forms) =>
  count === 1 ? forms.one : forms.many;

const ukForm = (count: number, forms: Forms) => {
  const value = Math.abs(Math.trunc(count));
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms.few;
  }
  return forms.many;
};

const en = {
  title: 'Shopping List',
  share:
    'You can share this list. Anyone with the link can open it and buy the products. This page is not private.',
  dishes: 'Recipes in this menu',
  noDishes: 'This menu has no recipes yet.',
  servingsDiffer:
    'These recipes serve different numbers of people, so the count is shown on each dish.',
  empty: 'This menu has no ingredients to buy yet.',
  recipes: {
    one: '{{count}} recipe',
    few: '{{count}} recipes',
    many: '{{count}} recipes',
  },
  items: {
    one: '{{count}} item',
    few: '{{count}} items',
    many: '{{count}} items',
  },
  people: {
    one: 'for {{count}} person',
    few: 'for {{count}} people',
    many: 'for {{count}} people',
  },
  servings: {
    one: '{{count}} serving',
    few: '{{count}} servings',
    many: '{{count}} servings',
  },
  aisles: {
    produce: 'Produce',
    dairy: 'Dairy',
    meat: 'Meat',
    fish: 'Fish',
    grains: 'Grains',
    liquids: 'Liquids',
    baking: 'Baking & pantry',
    spices: 'Spices',
    other: 'Other',
  } satisfies Record<ShoppingAisle, string>,
};

const uk = {
  title: 'Список покупок',
  share:
    'Цим списком можна поділитися: інша людина відкриє посилання і купить продукти. Сторінка не приватна.',
  dishes: 'Страви в цьому меню',
  noDishes: 'У цьому меню ще немає страв.',
  servingsDiffer:
    'Кількість людей різна для страв, тож вона вказана біля кожної.',
  empty: 'У цьому меню ще немає інгредієнтів для покупки.',
  recipes: {
    one: '{{count}} страва',
    few: '{{count}} страви',
    many: '{{count}} страв',
  },
  items: {
    one: '{{count}} позиція',
    few: '{{count}} позиції',
    many: '{{count}} позицій',
  },
  people: {
    one: 'на {{count}} персону',
    few: 'на {{count}} персони',
    many: 'на {{count}} персон',
  },
  servings: {
    one: '{{count}} порція',
    few: '{{count}} порції',
    many: '{{count}} порцій',
  },
  aisles: {
    produce: 'Овочі та фрукти',
    dairy: 'Молочне',
    meat: "М'ясо",
    fish: 'Риба',
    grains: 'Крупи',
    liquids: 'Рідини',
    baking: 'Випічка і комора',
    spices: 'Спеції',
    other: 'Інше',
  } satisfies Record<ShoppingAisle, string>,
};

export const toShoppingLang = (value: unknown): ShoppingLang => {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === 'string' && raw.toLowerCase().startsWith('uk')
    ? 'uk'
    : 'en';
};

export const shoppingCopy = (lang: ShoppingLang) => {
  const text = lang === 'uk' ? uk : en;
  return {
    ...text,
    count: (forms: Forms, count: number) => phrase(count, forms, lang),
    people: (count: number) => phrase(count, text.people, lang),
    servings: (count: number) => phrase(count, text.servings, lang),
  };
};
