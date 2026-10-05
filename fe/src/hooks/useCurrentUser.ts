import { useQuery } from '@tanstack/react-query'

import { currentUserQueryOptions } from '@/features/profile/api/profile.queries'

import { useAuthSession } from './useAuthSession'

export function useCurrentUser() {
  const { isAuthenticated } = useAuthSession()

  const query = useQuery({
    ...currentUserQueryOptions,
    enabled: isAuthenticated,
  })

  return {
    isAuthenticated,
    user: isAuthenticated ? (query.data ?? null) : null,
    isLoading: isAuthenticated && (query.isPending || query.isFetching),
    isError: isAuthenticated && query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
