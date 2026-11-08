import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { currentUserQueryOptions } from '@/features/profile/api/profile.queries'
import { adoptSessionUser, useSessionUserId } from '@/lib/session-user'

import { useAuthSession } from './useAuthSession'

export function useCurrentUser() {
  const { isAuthenticated } = useAuthSession()
  const sessionUserId = useSessionUserId()

  const query = useQuery({
    ...currentUserQueryOptions(),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (query.data?.id) adoptSessionUser(query.data.id)
  }, [query.data?.id])

  const profile = query.data
  const sameAccount =
    sessionUserId == null || profile?.id.toLowerCase() === sessionUserId
  const user = isAuthenticated && profile && sameAccount ? profile : null

  return {
    isAuthenticated,
    user,
    isLoading: isAuthenticated && user == null && (query.isPending || query.isFetching),
    isError: isAuthenticated && query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
