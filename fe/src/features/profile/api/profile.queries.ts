import { queryOptions } from '@tanstack/react-query'

import { sessionViewerKey } from '@/lib/session-user'

import { profileApi } from './profile.api'

export const profileQueryKeys = {
  all: () => ['profile'] as const,
  me: () => [...profileQueryKeys.all(), 'me', sessionViewerKey()] as const,
}

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKeys.me(),
    queryFn: () => profileApi.getMe(),
    staleTime: 0,
  })

export const profileQueries = {
  profileQueryKeys,
  currentUserQueryOptions,
}
