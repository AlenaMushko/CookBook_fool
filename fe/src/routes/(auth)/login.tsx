import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@pages/auth/LoginPage'
import { safeRedirectPath } from '@/lib/safe-redirect'

type LoginSearch = {
  redirect?: string
}

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: safeRedirectPath(search.redirect),
  }),
  component: LoginRoutePage,
})

function LoginRoutePage() {
  const { redirect } = Route.useSearch()

  return <LoginPage redirect={redirect} />
}
