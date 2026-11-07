import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { recipesApi } from '../api/recipes.api'
import { recipeQueryKeys } from '../api/recipes.queries'

export const useDishCategories = () => {
  const query = useQuery({
    queryKey: recipeQueryKeys.categories(),
    queryFn: () => recipesApi.listCategories(),
  })

  return useMemo(
    () => [...(query.data?.data ?? [])].sort((left, right) => left.order - right.order),
    [query.data],
  )
}
