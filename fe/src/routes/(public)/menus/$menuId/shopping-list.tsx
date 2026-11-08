import { createFileRoute } from '@tanstack/react-router'

import { ShoppingListPage } from '@pages/menus'

export const Route = createFileRoute('/(public)/menus/$menuId/shopping-list')({
  component: ShoppingListPage,
})
