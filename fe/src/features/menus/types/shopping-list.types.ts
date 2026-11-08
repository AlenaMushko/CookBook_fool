export type ShoppingListItem = {
  id: string
  ingredientId: string
  nameEn: string
  nameUk: string
  quantity: number
  unitCode: string
  unitNameEn: string
  unitNameUk: string
  symbolEn: string
  symbolUk: string
  image: string | null
}

export type ShoppingListGroup = {
  id: string
  items: ShoppingListItem[]
}

export type ShoppingListDish = {
  id: string
  title: string
  servings: number | null
}

export type ShoppingList = {
  menuId: string
  name: string
  occasion: string | null
  dishesCount: number
  itemsCount: number
  servings: number | null
  dishes: ShoppingListDish[]
  groups: ShoppingListGroup[]
}
