export type DishDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type DishVisibility = 'PUBLIC' | 'PRIVATE'

export type CatalogIngredient = {
  id: string
  nameEn: string
  nameUk: string
  image?: string | null
}

export type DishCategory = {
  id: string
  nameEn: string
  nameUk: string
  slug: string
  order: number
}

export type MeasurementUnit = {
  id: string
  code: string
  nameEn: string
  nameUk: string
  symbolEn?: string
  symbolUk?: string
  type: string
  order: number
}

export type RecipeIngredientDraft = {
  ingredient: CatalogIngredient | null
  unitId: string
  quantity: string
}

export type RecipeStepDraft = {
  title: string
  description: string
  photos: DishPhoto[]
}

export type DishPhoto = {
  key: string
  order: number
  url: string
}

export type CreateRecipeFormValues = {
  title: string
  description: string
  prepTime: string
  difficulty: DishDifficulty
  visibility: DishVisibility
  categoryId: string
  ingredients: RecipeIngredientDraft[]
  steps: RecipeStepDraft[]
  photos: DishPhoto[]
}

export type CreateDishPayload = {
  title: string
  description?: string
  prepTime?: number
  visibility: DishVisibility
  difficulty: DishDifficulty
  categoryId: string
  ingredients: {
    ingredientId: string
    unitId: string
    quantity: number
    order: number
  }[]
  steps: {
    order: number
    title?: string
    description: string
    photos?: { key: string; order: number }[]
  }[]
  photos: { key: string; order: number }[]
}

export type CreatedDish = {
  id: string
}
