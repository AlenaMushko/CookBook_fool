import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@pages/auth/LoginPage'

type LoginSearch = {
  redirect?: string
}

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect:
      typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginRoutePage,
})

function LoginRoutePage() {
  const { redirect } = Route.useSearch()

  return <LoginPage redirect={redirect} />
}
