import { formatAmount } from './recipe-measures'
import type { CreateRecipeFormValues, DishDetails } from '../types/recipe.types'

const toPhotos = (photos: { key: string; order: number; url?: string }[] | undefined) => {
  return [...(photos ?? [])]
    .sort((a, b) => a.order - b.order)
    .filter((photo) => photo.key)
    .map((photo) => ({
      key: photo.key,
      order: photo.order,
      url: photo.url ?? '',
    }))
}

export const dishToFormValues = (dish: DishDetails): CreateRecipeFormValues => {
  const ingredients = [...dish.ingredients].sort((a, b) => a.order - b.order)
  const steps = [...dish.steps].sort((a, b) => a.order - b.order)
  const servings =
    dish.baseServings && dish.baseServings >= 1
      ? String(Math.round(dish.baseServings))
      : '6'

  return {
    title: dish.title,
    description: dish.description ?? '',
    cookTime: dish.cookTime ? String(dish.cookTime) : '',
    servings,
    categoryId: dish.categoryId,
    areaId: dish.areaId ?? dish.area?.id ?? '',
    difficulty: dish.difficulty,
    visibility: dish.visibility,
    photos: toPhotos(dish.photos),
    ingredients: ingredients.length
      ? ingredients.map((item) => ({
          ingredient: {
            id: item.ingredientId,
            nameEn: item.nameEn,
            nameUk: item.nameUk,
            image: item.image,
          },
          unitId: item.unitId,
          quantity: formatAmount(item.quantity),
          ...(item.groupId ? { groupId: item.groupId } : {}),
        }))
      : [{ ingredient: null, unitId: '', quantity: '' }],
    steps: steps.length
      ? steps.map((step) => ({
          title: step.title ?? '',
          description: step.description ?? '',
          photos: toPhotos(step.photos),
        }))
      : [{ title: '', description: '', photos: [] }],
  }
}
