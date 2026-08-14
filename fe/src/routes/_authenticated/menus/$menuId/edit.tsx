import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menus/$menuId/edit')({
  component: EditMenuPage,
})

function EditMenuPage() {
  const { menuId } = Route.useParams()
  return <div>Edit Menu {menuId}</div>
}
