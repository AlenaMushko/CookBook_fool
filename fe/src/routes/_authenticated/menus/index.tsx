import { createFileRoute } from '@tanstack/react-router'
import { MenusPage } from '@pages/menus'
import { myMenusQueryOptions } from '@/features/menus'

export const Route = createFileRoute('/_authenticated/menus/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(myMenusQueryOptions),
  component: MenusPage,
})
