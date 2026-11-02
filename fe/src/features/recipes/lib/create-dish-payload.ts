import type {
  CreateDishPayload,
  CreateRecipeFormValues,
  RecipeIngredientDraft,
  RecipeStepDraft,
} from '../types/recipe.types'

function filledText(value: string) {
  const trimmed = value.trim()
  return trimmed || undefined
}

function toIngredients(
  rows: RecipeIngredientDraft[],
): CreateDishPayload['ingredients'] {
  return rows
    .flatMap((row) => {
      if (!row.ingredient || !row.unitId || !row.quantity.trim()) return []
      return [
        {
          ingredientId: row.ingredient.id,
          unitId: row.unitId,
          quantity: Number(row.quantity.replace(',', '.')),
        },
      ]
    })
    .map((row, order) => ({ ...row, order }))
}

function toSteps(steps: RecipeStepDraft[]): CreateDishPayload['steps'] {
  return steps
    .flatMap((step) => {
      const description = step.description.trim()
      if (!description) return []
      const title = step.title.trim()
      return [
        {
          description,
          ...(title ? { title } : {}),
          ...(step.photos.length
            ? {
                photos: step.photos.map(({ key, order }) => ({ key, order })),
              }
            : {}),
        },
      ]
    })
    .map((step, index) => ({ ...step, order: index + 1 }))
}

export function toCreateDishPayload(
  values: CreateRecipeFormValues,
): CreateDishPayload {
  const description = filledText(values.description)
  const prepTime = filledText(values.prepTime)

  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    ...(prepTime ? { prepTime: Number(prepTime) } : {}),
    visibility: values.visibility,
    difficulty: values.difficulty,
    categoryId: values.categoryId,
    ingredients: toIngredients(values.ingredients),
    steps: toSteps(values.steps),
    photos: values.photos.map(({ key, order }) => ({ key, order })),
  }
}
