import type { TFunction } from 'i18next'

import { LocalStorageKey } from '@constants/localStorage'
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/local-storage'

import { createRecipeSchema } from '../schemas/recipe.schema'
import type { CreateRecipeFormValues } from '../types/recipe.types'

const draftSchema = createRecipeSchema(((key: string) => key) as TFunction, 'draft')

export function readRecipeDraft(): CreateRecipeFormValues | null {
  const raw = getLocalStorage(LocalStorageKey.RecipeDraft)
  if (!raw) return null

  try {
    const parsed = draftSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      removeLocalStorage(LocalStorageKey.RecipeDraft)
      return null
    }
    return parsed.data
  } catch {
    removeLocalStorage(LocalStorageKey.RecipeDraft)
    return null
  }
}

export function saveRecipeDraft(values: CreateRecipeFormValues) {
  setLocalStorage(LocalStorageKey.RecipeDraft, JSON.stringify(values))
}

export function clearRecipeDraft() {
  removeLocalStorage(LocalStorageKey.RecipeDraft)
}
