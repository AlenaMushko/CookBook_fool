import { createFileRoute } from '@tanstack/react-router'
import { CreateMenuPage } from '@pages/menus'

export const Route = createFileRoute('/_authenticated/menus/new')({
  component: CreateMenuPage,
})
