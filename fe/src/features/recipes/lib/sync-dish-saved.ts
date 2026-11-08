import type { QueryKey } from '@tanstack/react-query'

import { queryClient } from '@api/queryClient'
import { DishListScope } from '@constants/recipe'
import { sessionViewerKey } from '@/lib/session-user'

import { recipeQueryKeys } from '../api/recipes.queries'
import type { DishDetails, DishListResult } from '../types/recipe.types'

export type DishSavedSnapshot = {
  lists: Array<[QueryKey, DishListResult | undefined]>
  details: Array<[QueryKey, DishDetails | undefined]>
}

function readScope(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('scope' in value)) return undefined
  const scope = (value as { scope?: unknown }).scope
  return typeof scope === 'string' ? scope : undefined
}

function listScope(queryKey: QueryKey): string | undefined {
  for (const part of queryKey) {
    const scope = readScope(part)
    if (scope) return scope
  }
  return undefined
}

function isCurrentViewer(queryKey: QueryKey): boolean {
  return queryKey.includes(sessionViewerKey())
}

export function captureDishSavedState(dishId: string): DishSavedSnapshot {
  return {
    lists: queryClient.getQueriesData<DishListResult>({
      queryKey: ['dishes', 'list'],
      predicate: (query) => isCurrentViewer(query.queryKey),
    }),
    details: queryClient.getQueriesData<DishDetails>({
      queryKey: [...recipeQueryKeys.dish(dishId), sessionViewerKey()],
    }),
  }
}

export function restoreDishSavedState(snapshot: DishSavedSnapshot) {
  for (const [key, data] of snapshot.lists) queryClient.setQueryData(key, data)
  for (const [key, data] of snapshot.details) queryClient.setQueryData(key, data)
}

export function syncDishSaved(dishId: string, nextSaved: boolean) {
  const lists = queryClient.getQueriesData<DishListResult>({
    queryKey: ['dishes', 'list'],
    predicate: (query) => isCurrentViewer(query.queryKey),
  })
  const refreshSavedLists = lists.some(([key, current]) => {
    if (!current || !nextSaved || listScope(key) !== DishListScope.SAVED) return false
    return !current.data.some((item) => item.id === dishId)
  })

  for (const [key, current] of lists) {
    if (!current) continue
    const dropFromSaved = listScope(key) === DishListScope.SAVED && !nextSaved
    let changed = false
    const data = current.data.flatMap((item) => {
      if (item.id !== dishId) return [item]
      changed = true
      if (dropFromSaved) return []
      const delta = Number(nextSaved) - Number(Boolean(item.isLiked))
      return [
        {
          ...item,
          isLiked: nextSaved,
          likesCount: Math.max(0, (item.likesCount ?? 0) + delta),
        },
      ]
    })
    if (!changed) continue
    const removed = data.length < current.data.length
    queryClient.setQueryData<DishListResult>(key, {
      ...current,
      data,
      meta: removed
        ? { ...current.meta, total: Math.max(0, current.meta.total - 1) }
        : current.meta,
    })
  }

  queryClient.setQueriesData<DishDetails>(
    {
      queryKey: [...recipeQueryKeys.dish(dishId), sessionViewerKey()],
    },
    (current) => {
      if (!current) return current
      const delta = Number(nextSaved) - Number(Boolean(current.isLiked))
      return {
        ...current,
        isLiked: nextSaved,
        likesCount: Math.max(0, current.likesCount + delta),
      }
    },
  )

  if (!refreshSavedLists) return
  void queryClient.invalidateQueries({
    queryKey: ['dishes', 'list'],
    refetchType: 'none',
    predicate: (query) =>
      isCurrentViewer(query.queryKey) && listScope(query.queryKey) === DishListScope.SAVED,
  })
}
