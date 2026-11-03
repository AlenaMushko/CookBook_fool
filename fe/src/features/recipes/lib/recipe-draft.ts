import type { TFunction } from 'i18next'

import { LocalStorageKey } from '@constants/localStorage'
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/local-storage'

import { createRecipeSchema } from '../schemas/recipe.schema'
import type { CreateRecipeFormValues } from '../types/recipe.types'

export const RECIPE_DRAFT_AUTOSAVE_MS = 60_000

const draftSchema = createRecipeSchema(((key: string) => key) as TFunction, 'draft')

const hasDraftShape = (value: unknown): value is CreateRecipeFormValues => {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return (
    typeof draft.title === 'string' &&
    typeof draft.description === 'string' &&
    typeof draft.prepTime === 'string' &&
    typeof draft.servings === 'string' &&
    typeof draft.categoryId === 'string' &&
    (draft.difficulty === 'EASY' ||
      draft.difficulty === 'MEDIUM' ||
      draft.difficulty === 'HARD') &&
    (draft.visibility === 'PUBLIC' || draft.visibility === 'PRIVATE') &&
    Array.isArray(draft.photos) &&
    Array.isArray(draft.ingredients) &&
    Array.isArray(draft.steps)
  )
}

export const readRecipeDraft = (): CreateRecipeFormValues | null => {
  const raw = getLocalStorage(LocalStorageKey.RecipeDraft)
  if (!raw) return null

  try {
    const json: unknown = JSON.parse(raw)
    if (json && typeof json === 'object' && !('servings' in json)) {
      ;(json as { servings?: string }).servings = '6'
    }
    const parsed = draftSchema.safeParse(json)
    if (parsed.success) return parsed.data
    if (hasDraftShape(json)) return json
    removeLocalStorage(LocalStorageKey.RecipeDraft)
    return null
  } catch {
    removeLocalStorage(LocalStorageKey.RecipeDraft)
    return null
  }
}

export const saveRecipeDraft = (values: CreateRecipeFormValues) => {
  setLocalStorage(LocalStorageKey.RecipeDraft, JSON.stringify(values))
}

export const clearRecipeDraft = () => {
  removeLocalStorage(LocalStorageKey.RecipeDraft)
}
