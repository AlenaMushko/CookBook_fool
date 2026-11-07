import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

import type {
  CreateMenuInput,
  MenuBoardDraft,
  MenuDetail,
  MenuPreview,
  UpdateMenuInput,
} from '../types/menu.types'

const isNewStage = (id: string) => id.startsWith('tmp:')

export const menusApi = {
  listMine() {
    return apiJson<{ data: MenuPreview[] }>(ApiRoutes.menu.all)
  },

  getById(menuId: string) {
    return apiJson<MenuDetail>(ApiRoutes.menu.byId(menuId))
  },

  create(input: CreateMenuInput) {
    return apiJson<{ id: string }>(ApiRoutes.menu.all, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  update(params: { menuId: string; input: UpdateMenuInput }) {
    return apiJson<unknown>(ApiRoutes.menu.byId(params.menuId), {
      method: 'PATCH',
      body: JSON.stringify(params.input),
    })
  },

  delete(menuId: string) {
    return apiJson<void>(ApiRoutes.menu.byId(menuId), { method: 'DELETE' })
  },

  createSection(menuId: string, input: { name: string; order: number }) {
    return apiJson<{ id: string }>(ApiRoutes.menu.sections(menuId), {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  updateSection(
    menuId: string,
    sectionId: string,
    input: { name?: string; order?: number },
  ) {
    return apiJson<unknown>(ApiRoutes.menu.section(menuId, sectionId), {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  deleteSection(menuId: string, sectionId: string) {
    return apiJson<void>(ApiRoutes.menu.section(menuId, sectionId), {
      method: 'DELETE',
    })
  },

  addDishes(menuId: string, dishIds: string[], sectionId?: string | null) {
    return apiJson<{ data: unknown[] }>(ApiRoutes.menu.dishes(menuId), {
      method: 'POST',
      body: JSON.stringify({
        dishIds,
        ...(sectionId !== undefined && { sectionId }),
      }),
    })
  },

  updateDish(
    menuId: string,
    dishId: string,
    input: { sectionId?: string | null; order?: number },
  ) {
    return apiJson<unknown>(ApiRoutes.menu.dish(menuId, dishId), {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  removeDish(menuId: string, dishId: string) {
    return apiJson<void>(ApiRoutes.menu.dish(menuId, dishId), { method: 'DELETE' })
  },

  async saveBoard(menuId: string, baseline: MenuDetail, draft: MenuBoardDraft) {
    const name = draft.name.trim()
    const description = draft.description.trim()
    const occasion = draft.occasion.trim()
    if (
      name !== baseline.name ||
      description !== (baseline.description ?? '') ||
      occasion !== (baseline.occasion ?? '')
    ) {
      await this.update({
        menuId,
        input: { name, description, occasion },
      })
    }

    const kept = draft.sections.filter((section) => !isNewStage(section.id))
    const keptIds = new Set(kept.map((section) => section.id))
    const savedSections = [...baseline.sections].sort((a, b) => a.order - b.order)
    const sectionsDirty =
      savedSections.length !== draft.sections.length ||
      draft.sections.some((section, index) => {
        const current = savedSections[index]
        return !current || current.id !== section.id || current.name !== section.name.trim()
      })
    const idMap = new Map<string, string>()

    if (sectionsDirty) {
      await Promise.all(
        baseline.sections
          .filter((section) => !keptIds.has(section.id))
          .map((section) => this.deleteSection(menuId, section.id)),
      )
      await Promise.all(
        kept.map((section) => this.updateSection(menuId, section.id, { name: section.id })),
      )
      try {
        for (const [index, section] of draft.sections.entries()) {
          if (!isNewStage(section.id)) continue
          const created = await this.createSection(menuId, {
            name: section.name.trim(),
            order: index,
          })
          idMap.set(section.id, created.id)
        }
        await Promise.all(
          kept.map((section) =>
            this.updateSection(menuId, section.id, {
              name: section.name.trim(),
              order: draft.sections.findIndex((item) => item.id === section.id),
            }),
          ),
        )
      } catch (error) {
        await Promise.all(
          kept.map((section) => {
            const original = baseline.sections.find((item) => item.id === section.id)
            if (!original) return Promise.resolve()
            return this.updateSection(menuId, section.id, {
              name: original.name,
              order: original.order,
            }).catch(() => undefined)
          }),
        )
        throw error
      }
    }

    const sectionIdOf = (sectionId: string | null) =>
      sectionId ? (idMap.get(sectionId) ?? sectionId) : null

    const draftIds = new Set(draft.dishes.map((dish) => dish.dishId))
    await Promise.all(
      baseline.dishes
        .filter((dish) => !draftIds.has(dish.dishId))
        .map((dish) => this.removeDish(menuId, dish.dishId)),
    )

    const baselineIds = new Set(baseline.dishes.map((dish) => dish.dishId))
    const fresh = new Map<string, string[]>()
    for (const dish of draft.dishes) {
      if (baselineIds.has(dish.dishId)) continue
      const key = sectionIdOf(dish.sectionId) ?? ''
      const ids = fresh.get(key) ?? []
      ids.push(dish.dishId)
      fresh.set(key, ids)
    }
    for (const [key, dishIds] of fresh) {
      await this.addDishes(menuId, dishIds, key || null)
    }

    await Promise.all(
      draft.dishes.map((dish) =>
        this.updateDish(menuId, dish.dishId, {
          sectionId: sectionIdOf(dish.sectionId),
          order: draft.dishes
            .filter((item) => item.sectionId === dish.sectionId)
            .findIndex((item) => item.dishId === dish.dishId),
        }),
      ),
    )

    return this.getById(menuId)
  },
}
