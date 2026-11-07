import {
  closestCenter,
  pointerWithin,
  type CollisionDetection,
  type UniqueIdentifier,
} from '@dnd-kit/core'

import type { DishListCard } from '@/features/recipes/types/recipe.types'

export type MenuDragData =
  | { kind: 'stage'; stageId: string }
  | { kind: 'dish'; dishId: string; sectionId: string | null }
  | { kind: 'pick'; dish: DishListCard }
  | { kind: 'stage-body'; stageId: string | null }

export const stageDragId = (stageId: string) => `stage:${stageId}`

export const dishDragId = (dishId: string) => `dish:${dishId}`

export const pickDragId = (dishId: string) => `pick:${dishId}`

export const stageBodyId = (stageId: string | null) => `stage-body:${stageId ?? 'loose'}`

export const readDragData = (data: unknown): MenuDragData | null => {
  if (!data || typeof data !== 'object' || !('kind' in data)) return null
  return data as MenuDragData
}

const areaOf = (
  rects: Parameters<CollisionDetection>[0]['droppableRects'],
  id: UniqueIdentifier,
) => {
  const rect = rects.get(id)
  if (!rect) return Number.POSITIVE_INFINITY
  return rect.width * rect.height
}

const dataOf = (
  args: Parameters<CollisionDetection>[0],
  id: UniqueIdentifier,
) => {
  const container = args.droppableContainers.find((item) => item.id === id)
  return readDragData(container?.data.current)
}

const byArea = (args: Parameters<CollisionDetection>[0]) => (left: { id: UniqueIdentifier }, right: { id: UniqueIdentifier }) =>
  areaOf(args.droppableRects, left.id) - areaOf(args.droppableRects, right.id)

export const mostSpecificDrop: CollisionDetection = (args) => {
  const hits = pointerWithin(args).filter((hit) => hit.id !== args.active.id)
  const active = readDragData(args.active.data.current)

  if (active?.kind === 'stage') {
    const pool = hits.length > 0 ? hits : closestCenter(args).filter((hit) => hit.id !== args.active.id)
    const stages = pool.filter((hit) => dataOf(args, hit.id)?.kind === 'stage')
    if (stages.length > 0) return stages
  }

  if ((active?.kind === 'dish' || active?.kind === 'pick') && hits.length > 0) {
    const [body] = hits.filter((hit) => dataOf(args, hit.id)?.kind === 'stage-body').sort(byArea(args))
    const bodyData = body ? dataOf(args, body.id) : null
    if (body && bodyData?.kind === 'stage-body') {
      const dishes = hits
        .filter((hit) => {
          const data = dataOf(args, hit.id)
          return data?.kind === 'dish' && data.sectionId === bodyData.stageId
        })
        .sort(byArea(args))
      return dishes.length > 0 ? dishes : [body]
    }
  }

  if (hits.length === 0) return closestCenter(args).filter((hit) => hit.id !== args.active.id)

  return [...hits].sort(byArea(args))
}
