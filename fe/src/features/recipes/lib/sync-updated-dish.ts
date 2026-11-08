import { queryClient } from '@api/queryClient'
import { sessionViewerKey } from '@/lib/session-user'

import { recipeQueryKeys } from '../api/recipes.queries'
import type { DishDetails, DishListResult } from '../types/recipe.types'

export const syncUpdatedDish = (dish: DishDetails) => {
  const viewer = sessionViewerKey()
  queryClient.setQueryData([...recipeQueryKeys.dish(dish.id), viewer], dish)
  queryClient.setQueriesData<DishListResult>(
    {
      queryKey: ['dishes', 'list'],
      predicate: (query) => query.queryKey.includes(viewer),
    },
    (current) => {
    if (!current) return current
    let changed = false
    const data = current.data.map((item) => {
      if (item.id !== dish.id) return item
      changed = true
      return {
        ...item,
        title: dish.title,
        description: dish.description,
        difficulty: dish.difficulty,
        cookTime: dish.cookTime,
        baseServings: dish.baseServings,
        photos: dish.photos,
        category: dish.category,
        subcategory: dish.subcategory,
        likesCount: dish.likesCount,
        isLiked: dish.isLiked,
        isOwner: dish.isOwner,
      }
    })
    return changed ? { ...current, data } : current
  })
  void queryClient.invalidateQueries({
    queryKey: ['dishes', 'list'],
    predicate: (query) => query.queryKey.includes(viewer),
  })
}
