import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { hasAuthSession } from '@/lib/auth-session'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!hasAuthSession()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
