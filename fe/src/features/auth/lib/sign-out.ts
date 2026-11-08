import { Routes } from '@constants/routes'
import { clearAuthSessionCookie } from '@/lib/auth-session'
import { abortInflightRequests } from '@/lib/inflight'
import { clearSessionUser } from '@/lib/session-user'

import { authApi } from '../api/auth.api'

export async function signOut(): Promise<void> {
  abortInflightRequests()
  try {
    await authApi.logout()
  } finally {
    clearAuthSessionCookie()
    clearSessionUser()
    window.location.assign(Routes.HOME)
  }
}
