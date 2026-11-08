import { Outlet, createFileRoute } from '@tanstack/react-router'

import { requireAuthSession } from '@/lib/require-auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    requireAuthSession(location.href)
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
