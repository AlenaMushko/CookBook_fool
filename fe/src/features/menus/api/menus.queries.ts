import { mutationOptions, type QueryClient, queryOptions } from '@tanstack/react-query'
import { menusApi } from './menus.api'

export const menuQueryKeys = {
  all: () => ['menus'] as const,
  lists: () => [...menuQueryKeys.all(), 'list'] as const,
  detail: (menuId: string) => [...menuQueryKeys.all(), 'detail', menuId] as const,
  shopping: (menuId: string) => [...menuQueryKeys.all(), 'shopping', menuId] as const,
}

export const forgetShoppingList = (queryClient: QueryClient, menuId: string) => {
  queryClient.removeQueries({ queryKey: menuQueryKeys.shopping(menuId) })
}

export const myMenusQueryOptions = queryOptions({
  queryKey: menuQueryKeys.lists(),
  queryFn: () => menusApi.listMine(),
})

export const menuDetailsQueryOptions = (menuId: string) =>
  queryOptions({
    queryKey: menuQueryKeys.detail(menuId),
    queryFn: () => menusApi.getById(menuId),
  })

export const shoppingListQueryOptions = (menuId: string) =>
  queryOptions({
    queryKey: menuQueryKeys.shopping(menuId),
    queryFn: () => menusApi.shoppingList(menuId),
    staleTime: 0,
  })

export const updateMenuMutationOptions = mutationOptions({
  mutationFn: menusApi.update,
})

export const deleteMenuMutationOptions = mutationOptions({
  mutationFn: menusApi.delete,
})

export const menusQueries = {
  menuQueryKeys,
  myMenusQueryOptions,
  menuDetailsQueryOptions,
  shoppingListQueryOptions,
  updateMenuMutationOptions,
  deleteMenuMutationOptions,
}
