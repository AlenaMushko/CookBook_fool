import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

import type { Profile } from '../types/profile.types'

export const profileApi = {
  getMe() {
    return apiJson<Profile>(ApiRoutes.user.me)
  },
}
