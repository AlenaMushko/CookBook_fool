import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menus/$menuId/')({
  component: MenuPage,
})

function MenuPage() {
  const { menuId } = Route.useParams()
  return <div>Menu {menuId}</div>
}
