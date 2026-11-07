import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'

import { recipesApi } from '../api/recipes.api'

const LIST_CACHE_MS = 30 * 60 * 1000

export const useDishList = ({
  scopeKey,
  scope,
  categoryId,
  sort,
  order,
  page,
  pageSize,
}: {
  scopeKey: readonly unknown[]
  scope: DishListScope
  categoryId?: string
  sort: DishListSort
  order: DishListOrder
  page: number
  pageSize: number
}) => {
  const query = useQuery({
    queryKey: [
      ...scopeKey,
      { scope, categoryId: categoryId ?? null, sort, order, page, pageSize },
    ],
    queryFn: () =>
      recipesApi.list({
        scope,
        categoryId,
        sort,
        order,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: LIST_CACHE_MS,
  })

  const total = query.data?.meta.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return { query, total, pageCount }
}
