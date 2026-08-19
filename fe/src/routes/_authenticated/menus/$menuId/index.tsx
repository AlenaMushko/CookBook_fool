import { createFileRoute } from '@tanstack/react-router'
import { MenuDetailsPage } from '@pages/menus'
import { menuDetailsQueryOptions } from '@/features/menus'

export const Route = createFileRoute('/_authenticated/menus/$menuId/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(menuDetailsQueryOptions(params.menuId)),
  component: MenuDetailsRoute,
})

function MenuDetailsRoute() {
  const { menuId } = Route.useParams()
  return <MenuDetailsPage menuId={menuId} />
}
