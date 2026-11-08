import type { TFunction } from 'i18next'

import { LocalStorageKey } from '@constants/localStorage'
import { getSessionUserId } from '@/lib/session-user'
import { readUserScoped, writeUserScoped } from '@/lib/user-scoped-storage'
import type { DishListCard } from '@/features/recipes/types/recipe.types'

import { coverUrl } from './cover-url'
import { createMenuSchema, type CreateMenuValues } from '../schemas/menu.schema'

export const MENU_DRAFT_AUTOSAVE_MS = 60_000

export type MenuDraftDish = {
  id: string
  title: string
  difficulty: DishListCard['difficulty']
  cookTime?: number
  baseServings?: number
  coverUrl?: string
}

export type MenuDraftRecord = CreateMenuValues & {
  dishes: MenuDraftDish[]
}

const draftSchema = createMenuSchema(((key: string) => key) as TFunction, 'draft')

const difficulties = new Set<DishListCard['difficulty']>(['EASY', 'MEDIUM', 'HARD'])

const readDishes = (value: unknown): MenuDraftDish[] | null => {
  if (!value || typeof value !== 'object' || !('dishes' in value)) return []
  const dishes = value.dishes
  if (!Array.isArray(dishes)) return null

  const parsed: MenuDraftDish[] = []
  for (const item of dishes) {
    if (!item || typeof item !== 'object') return null
    const dish = item as Record<string, unknown>
    if (typeof dish.id !== 'string' || typeof dish.title !== 'string') return null
    if (!difficulties.has(dish.difficulty as DishListCard['difficulty'])) return null
    parsed.push({
      id: dish.id,
      title: dish.title,
      difficulty: dish.difficulty as DishListCard['difficulty'],
      cookTime: typeof dish.cookTime === 'number' ? dish.cookTime : undefined,
      baseServings: typeof dish.baseServings === 'number' ? dish.baseServings : undefined,
      coverUrl: typeof dish.coverUrl === 'string' ? dish.coverUrl : undefined,
    })
  }
  return parsed
}

export const dishToDraft = (dish: DishListCard): MenuDraftDish => ({
  id: dish.id,
  title: dish.title,
  difficulty: dish.difficulty,
  cookTime: dish.cookTime,
  baseServings: dish.baseServings,
  coverUrl: coverUrl(dish),
})

export const draftToDish = (dish: MenuDraftDish): DishListCard => ({
  id: dish.id,
  title: dish.title,
  difficulty: dish.difficulty,
  cookTime: dish.cookTime,
  baseServings: dish.baseServings,
  photos: dish.coverUrl
    ? [{ key: dish.coverUrl, url: dish.coverUrl, order: 0 }]
    : [],
})

const parseMenuDraft = (value: unknown): MenuDraftRecord | null => {
  const dishes = readDishes(value)
  const parsed = draftSchema.safeParse(value)
  if (parsed.success && dishes) return { ...parsed.data, dishes }
  return null
}

export const readMenuDraft = (): MenuDraftRecord | null => {
  const userId = getSessionUserId()
  if (!userId) return null
  return readUserScoped(LocalStorageKey.MenuDraft, userId, parseMenuDraft)
}

export const saveMenuDraft = (draft: MenuDraftRecord) => {
  const userId = getSessionUserId()
  if (!userId) return
  writeUserScoped(LocalStorageKey.MenuDraft, userId, draft)
}

export const clearMenuDraft = () => {
  const userId = getSessionUserId()
  if (!userId) return
  writeUserScoped(LocalStorageKey.MenuDraft, userId, undefined)
}
