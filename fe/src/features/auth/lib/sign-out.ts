import { queryClient } from '@api/queryClient'
import { clearAuthSessionCookie } from '@/lib/auth-session'
import { profileQueryKeys } from '@/features/profile/api/profile.queries'

import { authApi } from '../api/auth.api'

export async function signOut(): Promise<void> {
  try {
    await authApi.logout()
  } finally {
    clearAuthSessionCookie()
    queryClient.removeQueries({ queryKey: profileQueryKeys.all() })
  }
}
