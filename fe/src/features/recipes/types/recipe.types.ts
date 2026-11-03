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
  groupId?: string
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
  servings: string
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
  baseServings?: number
  ingredientGroups?: {
    tempId: string
    name?: string
    order: number
  }[]
  ingredients: {
    ingredientId: string
    unitId: string
    quantity: number
    groupTempId?: string
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

export type DishPhotoRef = {
  key: string
  order: number
  url?: string
}

export type DishDetails = {
  id: string
  title: string
  description?: string
  visibility: DishVisibility
  difficulty: DishDifficulty
  prepTime?: number
  cookTime?: number
  baseServings?: number
  categoryId: string
  likesCount: number
  isLiked?: boolean
  isOwner?: boolean
  photos?: DishPhotoRef[]
  steps: {
    order: number
    title?: string
    description?: string
    photos?: DishPhotoRef[]
  }[]
  category: { nameEn: string; nameUk: string }
  subcategory?: { nameEn: string; nameUk: string }
  owner: { id: string; firstName: string; lastName?: string }
  ingredientGroups: { id: string; name?: string; order: number }[]
  ingredients: {
    id: string
    ingredientId: string
    nameEn: string
    nameUk: string
    image?: string | null
    unitId: string
    quantity: number
    groupId?: string
    order: number
  }[]
}
