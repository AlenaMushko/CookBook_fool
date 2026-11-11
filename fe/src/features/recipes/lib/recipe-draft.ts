import type { TFunction } from 'i18next'

import { LocalStorageKey } from '@constants/localStorage'
import { getSessionUserId } from '@/lib/session-user'
import { readUserScoped, writeUserScoped } from '@/lib/user-scoped-storage'

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
    typeof draft.cookTime === 'string' &&
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

const parseRecipeDraft = (value: unknown): CreateRecipeFormValues | null => {
  if (value && typeof value === 'object') {
    const record = value as {
      servings?: string
      prepTime?: string
      cookTime?: string
      areaId?: string
    }
    if (!('servings' in record)) record.servings = '6'
    if (typeof record.prepTime === 'string' && typeof record.cookTime !== 'string') {
      record.cookTime = record.prepTime
    }
    if (typeof record.areaId !== 'string') record.areaId = ''
  }
  const parsed = draftSchema.safeParse(value)
  if (parsed.success) return parsed.data
  if (hasDraftShape(value)) return value
  return null
}

export const readRecipeDraft = (): CreateRecipeFormValues | null => {
  const userId = getSessionUserId()
  if (!userId) return null
  return readUserScoped(LocalStorageKey.RecipeDraft, userId, parseRecipeDraft)
}

export const saveRecipeDraft = (values: CreateRecipeFormValues) => {
  const userId = getSessionUserId()
  if (!userId) return
  writeUserScoped(LocalStorageKey.RecipeDraft, userId, values)
}

export const clearRecipeDraft = () => {
  const userId = getSessionUserId()
  if (!userId) return
  writeUserScoped(LocalStorageKey.RecipeDraft, userId, undefined)
}
