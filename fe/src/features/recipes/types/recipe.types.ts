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

export type DishArea = {
  id: string
  code: string
  nameEn: string
  nameUk: string
  flagSvg: string
  flagAlt: string
}

export type CreateRecipeFormValues = {
  title: string
  description: string
  cookTime: string
  servings: string
  difficulty: DishDifficulty
  visibility: DishVisibility
  categoryId: string
  areaId: string
  ingredients: RecipeIngredientDraft[]
  steps: RecipeStepDraft[]
  photos: DishPhoto[]
}

export type CreateDishPayload = {
  title: string
  description?: string
  cookTime?: number
  visibility: DishVisibility
  difficulty: DishDifficulty
  categoryId: string
  areaId?: string | null
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

export type { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'

export type DishListCard = {
  id: string
  title: string
  description?: string
  difficulty: DishDifficulty
  cookTime?: number
  baseServings?: number
  likesCount?: number
  photos?: DishPhotoRef[]
  isLiked?: boolean
  isOwner?: boolean
  category?: { nameEn: string; nameUk: string }
  subcategory?: { nameEn: string; nameUk: string }
  area?: DishArea
  owner?: { id: string; firstName: string; lastName?: string }
}

export type DishListResult = {
  data: DishListCard[]
  meta: {
    limit: number
    offset: number
    total: number
  }
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
  cookTime?: number
  baseServings?: number
  categoryId: string
  areaId?: string
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
  area?: DishArea
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
    gramsPerCup?: number
  }[]
}
