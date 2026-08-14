import { createFileRoute } from '@tanstack/react-router'
import { EditMenuPage } from '@pages/menus'

export const Route = createFileRoute('/_authenticated/menus/$menuId/edit')({
  component: EditMenuRoute,
})

function EditMenuRoute() {
  const { menuId } = Route.useParams()
  return <EditMenuPage menuId={menuId} />
}
