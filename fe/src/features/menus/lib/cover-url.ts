import type { DishListCard } from '@/features/recipes/types/recipe.types'

export const coverUrl = (dish: DishListCard) =>
  [...(dish.photos ?? [])].sort((a, b) => a.order - b.order)[0]?.url
