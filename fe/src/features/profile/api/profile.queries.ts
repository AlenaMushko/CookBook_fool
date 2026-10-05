import { queryOptions } from '@tanstack/react-query'

import { profileApi } from './profile.api'

export const profileQueryKeys = {
  all: () => ['profile'] as const,
  me: () => [...profileQueryKeys.all(), 'me'] as const,
}

export const currentUserQueryOptions = queryOptions({
  queryKey: profileQueryKeys.me(),
  queryFn: () => profileApi.getMe(),
})

export const profileQueries = {
  profileQueryKeys,
  currentUserQueryOptions,
}
