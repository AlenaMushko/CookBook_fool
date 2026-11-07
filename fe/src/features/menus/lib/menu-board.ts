import type { DishListCard } from '@/features/recipes/types/recipe.types'

import { coverUrl } from './cover-url'
import type { MenuBoardDraft, MenuDetail, MenuDishDraft, MenuStageDraft } from '../types/menu.types'

export const toBoardDraft = (menu: MenuDetail): MenuBoardDraft => {
  const sectionOrder = new Map(menu.sections.map((section) => [section.id, section.order]))
  const dishes = [...menu.dishes].sort((a, b) => {
    const aOrder = a.sectionId == null ? Number.MAX_SAFE_INTEGER : (sectionOrder.get(a.sectionId) ?? 0)
    const bOrder = b.sectionId == null ? Number.MAX_SAFE_INTEGER : (sectionOrder.get(b.sectionId) ?? 0)
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.order - b.order
  })

  return {
    name: menu.name,
    description: menu.description ?? '',
    occasion: menu.occasion ?? '',
    sections: [...menu.sections]
      .sort((a, b) => a.order - b.order)
      .map((section) => ({ id: section.id, name: section.name })),
    dishes: dishes.map((dish) => ({
      dishId: dish.dishId,
      sectionId: dish.sectionId,
      title: dish.title,
      cookTime: dish.cookTime,
      baseServings: dish.baseServings,
      coverUrl: dish.coverUrl,
    })),
  }
}

export const placementFromDish = (dish: DishListCard, sectionId: string | null): MenuDishDraft => ({
  dishId: dish.id,
  sectionId,
  title: dish.title,
  cookTime: dish.cookTime ?? null,
  baseServings: dish.baseServings ?? null,
  coverUrl: coverUrl(dish) ?? null,
})

const insertAt = (dishes: MenuDishDraft[], dish: MenuDishDraft, beforeDishId?: string) => {
  if (!beforeDishId) {
    const last = dishes.reduce(
      (index, item, itemIndex) => (item.sectionId === dish.sectionId ? itemIndex : index),
      -1,
    )
    const next = dishes.slice()
    next.splice(last + 1, 0, dish)
    return next
  }

  const index = dishes.findIndex((item) => item.dishId === beforeDishId)
  const next = dishes.slice()
  next.splice(index < 0 ? next.length : index, 0, dish)
  return next
}

export const moveStage = (
  sections: MenuStageDraft[],
  stageId: string,
  beforeStageId: string,
) => {
  if (stageId === beforeStageId) return sections
  const from = sections.findIndex((section) => section.id === stageId)
  const to = sections.findIndex((section) => section.id === beforeStageId)
  if (from < 0 || to < 0) return sections
  const next = sections.slice()
  const [stage] = next.splice(from, 1)
  next.splice(to, 0, stage)
  return next
}

export const placeDish = (
  dishes: MenuDishDraft[],
  dish: MenuDishDraft,
  beforeDishId?: string,
) => {
  const current = dishes.find((item) => item.dishId === dish.dishId)
  if (beforeDishId === dish.dishId && current?.sectionId === dish.sectionId) return dishes
  const rest = dishes.filter((item) => item.dishId !== dish.dishId)
  return insertAt(rest, dish, beforeDishId === dish.dishId ? undefined : beforeDishId)
}
