import { redirect } from '@tanstack/react-router'

import { hasAuthSession } from '@/lib/auth-session'
import { safeRedirectPath } from '@/lib/safe-redirect'

export function requireAuthSession(href: string): void {
  if (hasAuthSession()) return
  const next = safeRedirectPath(href)
  throw redirect({
    to: '/login',
    search: next ? { redirect: next } : {},
  })
}
