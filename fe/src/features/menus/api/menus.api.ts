import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

import type { CreateMenuInput, Menu, MenuPreview, UpdateMenuInput } from '../types/menu.types'

export const menusApi = {
  listMine() {
    return apiJson<{ data: MenuPreview[] }>(ApiRoutes.menu.all)
  },

  async getById(menuId: string): Promise<Menu | null> {
    // TODO: replace with real API call
    return {
      id: menuId,
      title: `Menu ${menuId}`,
    }
  },

  create(input: CreateMenuInput) {
    return apiJson<{ id: string }>(ApiRoutes.menu.all, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  addDishes(menuId: string, dishIds: string[]) {
    return apiJson<{ data: unknown[] }>(ApiRoutes.menu.dishes(menuId), {
      method: 'POST',
      body: JSON.stringify({ dishIds }),
    })
  },

  async update(params: { menuId: string; input: UpdateMenuInput }): Promise<Menu> {
    // TODO: replace with real API call
    return {
      id: params.menuId,
      title: params.input.title,
    }
  },

  async delete(menuId: string): Promise<void> {
    // TODO: replace with real API call
    void menuId
  },
}
