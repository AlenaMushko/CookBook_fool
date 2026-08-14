import { createFileRoute } from '@tanstack/react-router'
import { MenuDetailsPage } from '@pages/menus'

export const Route = createFileRoute('/_authenticated/menus/$menuId/')({
  component: MenuDetailsRoute,
})

function MenuDetailsRoute() {
  const { menuId } = Route.useParams()
  return <MenuDetailsPage menuId={menuId} />
}
