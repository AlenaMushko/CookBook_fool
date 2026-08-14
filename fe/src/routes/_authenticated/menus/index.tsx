import { createFileRoute } from '@tanstack/react-router'
import { MenusPage } from '@pages/menus'

export const Route = createFileRoute('/_authenticated/menus/')({
  component: MenusPage,
})
