import type { CreateMenuInput, Menu, UpdateMenuInput } from '../types/menu.types'

export const menusApi = {
  async listMine(): Promise<Menu[]> {
    // TODO: replace with real API call
    return []
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
      id: crypto.randomUUID(),
      title: input.title,
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
