import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

import type { CreateRecipeFormValues } from '../types/recipe.types'

const emptyIngredient = {
  ingredient: null,
  unitId: '',
  quantity: '1',
}

export function createRecipeSchema(
  t: TFunction,
  mode: 'publish' | 'draft' = 'publish',
) {
  const draft = mode === 'draft'
  const title = z
    .string()
    .trim()
    .max(30, { message: t('recipe.create.titleLength') })
  const photos = z.array(
    z.object({
      key: z.string().min(1),
      url: z.string().min(1),
      order: z.number().int().nonnegative(),
    }),
  )

  return z
    .object({
      title: draft
        ? title
        : title.min(3, { message: t('recipe.create.titleLength') }),
      description: z.string(),
      prepTime: z.string(),
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
        }),
      ),
      steps: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          photos: z.array(
            z.object({
              key: z.string().min(1),
              url: z.string().min(1),
              order: z.number().int().nonnegative(),
            }),
          ),
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

      const prepTime = values.prepTime.trim()
      if (prepTime && !/^[1-9]\d*$/.test(prepTime)) {
        ctx.addIssue({
          code: 'custom',
          message: t('recipe.create.prepTimeInvalid'),
          path: ['prepTime'],
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
        const quantity = Number(quantityText.replace(',', '.'))
        if (
          (draft ? quantityText.length > 0 : true) &&
          (!quantityText || !Number.isFinite(quantity) || quantity < 1)
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
