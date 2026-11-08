import type { TFunction } from 'i18next'
import { z } from 'zod'

import { DISH_PHOTO_LIMIT, MAX_SERVINGS, STEP_PHOTO_LIMIT } from '@constants/recipe'
import { TEXT } from '@messages/validation'

import { parseIngredientQuantity } from '../lib/ingredient-quantity'
import type { CreateRecipeFormValues } from '../types/recipe.types'

const emptyIngredient = {
  ingredient: null,
  unitId: '',
  quantity: '',
}

export const createRecipeSchema = (
  t: TFunction,
  mode: 'publish' | 'draft' = 'publish',
) => {
  const draft = mode === 'draft'
  const title = z
    .string()
    .trim()
    .max(30, { message: t('recipe.create.titleLength') })
  const photos = z
    .array(
      z.object({
        key: z.string().min(1),
        url: z.string(),
        order: z.number().int().nonnegative(),
      }),
    )
    .max(DISH_PHOTO_LIMIT, { message: t('recipe.create.photoLimit') })

  return z
    .object({
      title: draft
        ? title
        : title.min(3, { message: t('recipe.create.titleLength') }),
      description: z.string(),
      cookTime: z.string(),
      servings: z.string(),
      categoryId: draft
        ? z.string()
        : z.string().min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) }),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
      visibility: z.enum(['PUBLIC', 'PRIVATE']),
      photos,
      ingredients: z.array(
        z.object({
          ingredient: z
            .object({
              id: z.string(),
              nameEn: z.string(),
              nameUk: z.string(),
              image: z.string().nullable().optional(),
            })
            .nullable(),
          unitId: z.string(),
          quantity: z.string(),
          groupId: z.string().optional(),
        }),
      ),
      steps: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          photos: z
            .array(
              z.object({
                key: z.string().min(1),
                url: z.string(),
                order: z.number().int().nonnegative(),
              }),
            )
            .max(STEP_PHOTO_LIMIT, { message: t('recipe.create.stepPhotoLimit') }),
        }),
      ),
    })
    .superRefine((values, ctx) => {
      const description = values.description.trim()
      const descriptionTooShort = !draft && description.length < 3
      if (
        description &&
        (descriptionTooShort || description.length > 1000)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.descriptionLength'),
          path: ['description'],
        })
      }

      const cookTime = values.cookTime.trim()
      if (cookTime && !/^[1-9]\d*$/.test(cookTime)) {
        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.cookTimeInvalid'),
          path: ['cookTime'],
        })
      }

      const servings = values.servings.trim()
      const servingsCount = Number(servings)
      if (
        !/^[1-9]\d*$/.test(servings) ||
        servingsCount < 1 ||
        servingsCount > MAX_SERVINGS
      ) {
        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.servingsInvalid'),
          path: ['servings'],
        })
      }

      if (!draft && values.ingredients.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.ingredientRequired'),
          path: ['ingredients', 0, 'ingredient'],
        })
      }

      values.ingredients.forEach((row, index) => {
        if (!draft && !row.ingredient) {
          ctx.addIssue({
            code: 'custom',
            message: t(TEXT.ERROR.REQUIRED_FIELD),
            path: ['ingredients', index, 'ingredient'],
          })
        }

        if (!draft && !row.unitId) {
          ctx.addIssue({
            code: 'custom',
            message: t(TEXT.ERROR.REQUIRED_FIELD),
            path: ['ingredients', index, 'unitId'],
          })
        }

        const quantityText = row.quantity.trim()
        if (
          (draft ? quantityText.length > 0 : true) &&
          parseIngredientQuantity(quantityText) == null
        ) {
          ctx.addIssue({
            code: 'custom',
            message: t('recipe.create.quantityInvalid'),
            path: ['ingredients', index, 'quantity'],
          })
        }
      })

      if (draft) return

      values.steps.forEach((step, index) => {
        const started =
          step.title.trim().length > 0 ||
          step.description.trim().length > 0 ||
          step.photos.length > 0
        if (!started || step.description.trim()) return

        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.stepDescriptionRequired'),
          path: ['steps', index, 'description'],
        })
      })
    }) satisfies z.ZodType<CreateRecipeFormValues>
}

export const emptyIngredientRow = emptyIngredient
