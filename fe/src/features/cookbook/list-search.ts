import {
  DishListOrder,
  DishListScope,
  DishListSort,
} from '@constants/recipe'

import { COOKBOOK_SCOPES } from './constants'

export type CookbookSearch = {
  q?: string
  scope?: DishListScope
  category?: string
  sort?: DishListSort
  order?: DishListOrder
  page?: number
}

export type CookbookListState = {
  q: string
  scope: DishListScope
  category?: string
  sort: DishListSort
  order: DishListOrder
  page: number
}

const SCOPES = new Set<string>(COOKBOOK_SCOPES)
const SORTS = new Set<string>(Object.values(DishListSort))
const ORDERS = new Set<string>(Object.values(DishListOrder))

function oneOf<T extends string>(value: unknown, allowed: Set<string>): T | undefined {
  return typeof value === 'string' && allowed.has(value) ? (value as T) : undefined
}

function pageNumber(value: unknown): number | undefined {
  const page = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (!Number.isInteger(page) || page < 2) return undefined
  return page
}

export function parseCookbookSearch(search: Record<string, unknown>): CookbookSearch {
  return toCookbookSearch({
    q: typeof search.q === 'string' ? search.q : '',
    scope: oneOf<DishListScope>(search.scope, SCOPES) ?? DishListScope.PUBLIC,
    category: typeof search.category === 'string' ? search.category : undefined,
    sort: oneOf<DishListSort>(search.sort, SORTS) ?? DishListSort.SAVED,
    order: oneOf<DishListOrder>(search.order, ORDERS) ?? DishListOrder.DESC,
    page: pageNumber(search.page) ?? 1,
  })
}

export function cookbookStateFromSearch(search: CookbookSearch): CookbookListState {
  return {
    q: search.q ?? '',
    scope: search.scope ?? DishListScope.PUBLIC,
    category: search.category,
    sort: search.sort ?? DishListSort.SAVED,
    order: search.order ?? DishListOrder.DESC,
    page: search.page ?? 1,
  }
}

export function toCookbookSearch(state: CookbookListState): CookbookSearch {
  const search: CookbookSearch = {}
  if (state.q) search.q = state.q
  if (state.scope !== DishListScope.PUBLIC) search.scope = state.scope
  if (state.category) search.category = state.category
  if (state.sort !== DishListSort.SAVED) search.sort = state.sort
  if (state.order !== DishListOrder.DESC) search.order = state.order
  if (state.page > 1) search.page = state.page
  return search
}
