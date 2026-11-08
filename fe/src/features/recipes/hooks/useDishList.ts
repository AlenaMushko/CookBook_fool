import { useQuery } from '@tanstack/react-query'

import type { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'
import { useViewerKey } from '@/lib/session-user'

import { recipesApi } from '../api/recipes.api'
import { activeRecipeSearch } from '../lib/recipe-search'

const LIST_CACHE_MS = 30 * 60 * 1000

export const useDishList = ({
  scopeKey,
  scope,
  categoryId,
  search = '',
  sort,
  order,
  page,
  pageSize,
}: {
  scopeKey: readonly unknown[]
  scope: DishListScope
  categoryId?: string
  search?: string
  sort: DishListSort
  order: DishListOrder
  page: number
  pageSize: number
}) => {
  const activeSearch = activeRecipeSearch(search)
  const viewer = useViewerKey()

  const query = useQuery({
    queryKey: [
      ...scopeKey,
      viewer ?? 'pending',
      {
        scope,
        categoryId: categoryId ?? null,
        search: activeSearch ?? null,
        sort,
        order,
        page,
        pageSize,
      },
    ],
    queryFn: () =>
      recipesApi.list({
        scope,
        categoryId,
        search: activeSearch,
        sort,
        order,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
    enabled: viewer != null,
    placeholderData: (previousData, previousQuery) => {
      if (!viewer || !previousQuery?.queryKey.includes(viewer)) return undefined
      return previousData
    },
    staleTime: Infinity,
    gcTime: LIST_CACHE_MS,
    meta: { skipGlobalLoader: true },
  })

  const total = query.data?.meta.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return { query, total, pageCount }
}
