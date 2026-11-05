export const DISH_PHOTO_LIMIT = 4
export const STEP_PHOTO_LIMIT = 2
export const MAX_SERVINGS = 50

export const DishDifficultyLevel = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
} as const

export const DishListScope = {
  PUBLIC: 'public',
  CREATED_BY_ME: 'createdByMe',
  SAVED: 'saved',
  COOKBOOK: 'cookbook',
} as const

export type DishListScope = (typeof DishListScope)[keyof typeof DishListScope]

export const DishListSort = {
  CREATED: 'created',
  SAVED: 'saved',
  COOKED: 'cooked',
  DIFFICULTY: 'difficulty',
} as const

export type DishListSort = (typeof DishListSort)[keyof typeof DishListSort]

export const DishListOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type DishListOrder = (typeof DishListOrder)[keyof typeof DishListOrder]
