import { createFileRoute } from '@tanstack/react-router'
import { EditMenuPage } from '@pages/menus'
import { menuDetailsQueryOptions } from '@/features/menus'

export const Route = createFileRoute('/_authenticated/menus/$menuId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(menuDetailsQueryOptions(params.menuId)),
  component: EditMenuRoute,
})

function EditMenuRoute() {
  const { menuId } = Route.useParams()
  return <EditMenuPage menuId={menuId} />
}
