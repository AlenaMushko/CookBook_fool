import { redirect } from '@tanstack/react-router'

import { hasAuthSession } from '@/lib/auth-session'

export function requireAuthSession(href: string): void {
  if (hasAuthSession()) return
  throw redirect({
    to: '/login',
    search: { redirect: href },
  })
}
