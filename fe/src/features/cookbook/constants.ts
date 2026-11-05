import { Bookmark, Calendar, ChefHat, CookingPot } from 'lucide-react'

import { DishListScope, DishListSort } from '@constants/recipe'

export const COOKBOOK_PAGE_SIZE = 12

export const COOKBOOK_SCOPES = [
  DishListScope.PUBLIC,
  DishListScope.CREATED_BY_ME,
  DishListScope.SAVED,
] as const

export type CookbookView = 'grid' | 'list'

export const COOKBOOK_SORT_CHIPS = [
  { key: DishListSort.CREATED, icon: Calendar },
  { key: DishListSort.SAVED, icon: Bookmark },
  { key: DishListSort.COOKED, icon: CookingPot },
  { key: DishListSort.DIFFICULTY, icon: ChefHat },
] as const

export const cookbookScopeKey = {
  [DishListScope.PUBLIC]: 'all',
  [DishListScope.CREATED_BY_ME]: 'created',
  [DishListScope.SAVED]: 'saved',
} as const
