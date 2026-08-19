import type { QueryClient } from '@tanstack/react-query'
import type { AuthUser } from '@features/auth'

export type RouterContext = {
  queryClient: QueryClient
  auth: {
    user: AuthUser | null
    isAuthenticated: boolean
  }
}
