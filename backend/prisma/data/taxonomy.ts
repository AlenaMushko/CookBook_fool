export interface TaxonomySubcategory {
  slug: string;
  nameEn: string;
  nameUk: string;
}

export interface TaxonomyCategory {
  slug: string;
  nameEn: string;
  nameUk: string;
  subcategories: TaxonomySubcategory[];
}

export const TAXONOMY: TaxonomyCategory[] = [
  {
    slug: 'soups',
    nameEn: 'Soups',
    nameUk: 'Супи',
    subcategories: [
      { slug: 'vegetable-soups', nameEn: 'Vegetable Soups', nameUk: 'Овочеві супи' },
      { slug: 'meat-soups', nameEn: 'Meat Soups', nameUk: "М'ясні супи" },
      { slug: 'cream-soups', nameEn: 'Cream Soups', nameUk: 'Крем-супи' },
      { slug: 'cold-soups', nameEn: 'Cold Soups', nameUk: 'Холодні супи' },
    ],
  },
  {
    slug: 'main-dishes',
    nameEn: 'Main Dishes',
    nameUk: 'Основні страви',
    subcategories: [
      { slug: 'chicken', nameEn: 'Chicken', nameUk: 'Курка' },
      { slug: 'beef', nameEn: 'Beef', nameUk: 'Яловичина' },
      { slug: 'pork', nameEn: 'Pork', nameUk: 'Свинина' },
      { slug: 'fish', nameEn: 'Fish', nameUk: 'Риба' },
      { slug: 'vegetarian', nameEn: 'Vegetarian', nameUk: 'Вегетаріанські' },
      { slug: 'pasta', nameEn: 'Pasta', nameUk: 'Паста' },
      { slug: 'rice', nameEn: 'Rice', nameUk: 'Рис' },
    ],
  },
  {
    slug: 'salads',
    nameEn: 'Salads',
    nameUk: 'Салати',
    subcategories: [
      { slug: 'fresh-salads', nameEn: 'Fresh Salads', nameUk: 'Свіжі салати' },
      { slug: 'warm-salads', nameEn: 'Warm Salads', nameUk: 'Теплі салати' },
      { slug: 'meat-salads', nameEn: 'Meat Salads', nameUk: "М'ясні салати" },
      { slug: 'vegetarian-salads', nameEn: 'Vegetarian Salads', nameUk: 'Вегетаріанські салати' },
    ],
  },
  {
    slug: 'desserts',
    nameEn: 'Desserts',
    nameUk: 'Десерти',
    subcategories: [
      { slug: 'cakes', nameEn: 'Cakes', nameUk: 'Торти' },
      { slug: 'cookies', nameEn: 'Cookies', nameUk: 'Печиво' },
      { slug: 'pastries', nameEn: 'Pastries', nameUk: 'Випічка' },
      { slug: 'no-bake-desserts', nameEn: 'No-Bake Desserts', nameUk: 'Десерти без випікання' },
    ],
  },
  {
    slug: 'bakery',
    nameEn: 'Bakery',
    nameUk: 'Випічка',
    subcategories: [
      { slug: 'bread', nameEn: 'Bread', nameUk: 'Хліб' },
      { slug: 'buns', nameEn: 'Buns', nameUk: 'Булочки' },
      { slug: 'savoury-baking', nameEn: 'Savoury Baking', nameUk: 'Солона випічка' },
      { slug: 'sweet-baking', nameEn: 'Sweet Baking', nameUk: 'Солодка випічка' },
    ],
  },
  {
    slug: 'drinks',
    nameEn: 'Drinks',
    nameUk: 'Напої',
    subcategories: [
      { slug: 'hot-drinks', nameEn: 'Hot Drinks', nameUk: 'Гарячі напої' },
      { slug: 'cold-drinks', nameEn: 'Cold Drinks', nameUk: 'Холодні напої' },
      { slug: 'smoothies', nameEn: 'Smoothies', nameUk: 'Смузі' },
    ],
  },
  {
    slug: 'preserves',
    nameEn: 'Preserves',
    nameUk: 'Заготівлі',
    subcategories: [
      { slug: 'jams', nameEn: 'Jams', nameUk: 'Джеми' },
      { slug: 'pickles', nameEn: 'Pickles', nameUk: 'Маринади' },
      { slug: 'sauces', nameEn: 'Sauces', nameUk: 'Соуси' },
    ],
  },
];
