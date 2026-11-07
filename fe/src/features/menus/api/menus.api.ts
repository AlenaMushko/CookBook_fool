import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

import { generateUuid } from '../../../lib/device'
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

  async create(input: CreateMenuInput): Promise<Menu> {
    // TODO: replace with real API call
    return {
      id: generateUuid(),
      title: input.title ?? '',
    }
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
