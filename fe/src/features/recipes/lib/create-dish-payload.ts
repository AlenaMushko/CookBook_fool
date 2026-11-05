import type {
  CreateDishPayload,
  CreateRecipeFormValues,
  RecipeIngredientDraft,
  RecipeStepDraft,
} from '../types/recipe.types'

const filledText = (value: string) => {
  const trimmed = value.trim()
  return trimmed || undefined
}

const toIngredients = (
  rows: RecipeIngredientDraft[],
  groupIds: Set<string>,
): CreateDishPayload['ingredients'] => {
  return rows
    .flatMap((row) => {
      if (!row.ingredient || !row.unitId || !row.quantity.trim()) return []
      const groupTempId =
        row.groupId && groupIds.has(row.groupId) ? row.groupId : undefined
      return [
        {
          ingredientId: row.ingredient.id,
          unitId: row.unitId,
          quantity: Number(row.quantity.replace(',', '.')),
          ...(groupTempId ? { groupTempId } : {}),
        },
      ]
    })
    .map((row, order) => ({ ...row, order }))
}

const toSteps = (steps: RecipeStepDraft[]): CreateDishPayload['steps'] => {
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

export const toCreateDishPayload = (
  values: CreateRecipeFormValues,
  groups: { id: string; name?: string; order: number }[] = [],
): CreateDishPayload => {
  const description = filledText(values.description)
  const cookTime = filledText(values.cookTime)
  const ingredients = toIngredients(
    values.ingredients,
    new Set(groups.map((group) => group.id)),
  )
  const usedGroups = new Set(
    ingredients.flatMap((item) => (item.groupTempId ? [item.groupTempId] : [])),
  )
  const ingredientGroups = groups
    .filter((group) => usedGroups.has(group.id))
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      tempId: group.id,
      order: group.order,
      ...(group.name ? { name: group.name } : {}),
    }))

  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    ...(cookTime ? { cookTime: Number(cookTime) } : {}),
    baseServings: Number(values.servings),
    visibility: values.visibility,
    difficulty: values.difficulty,
    categoryId: values.categoryId,
    ...(ingredientGroups.length > 0 ? { ingredientGroups } : {}),
    ingredients,
    steps: toSteps(values.steps),
    photos: values.photos.map(({ key, order }) => ({ key, order })),
  }
}
