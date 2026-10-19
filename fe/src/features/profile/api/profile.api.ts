import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'
import { S3Folder } from '@constants/s3-folders'

import type { Profile } from '../types/profile.types'

export type UpdateProfilePayload = {
  firstName?: string
  lastName?: string
  phone?: string | null
  image?: string | null
}

export const profileApi = {
  getMe() {
    return apiJson<Profile>(ApiRoutes.user.me)
  },

  updateMe(payload: UpdateProfilePayload) {
    return apiJson<Profile>(ApiRoutes.user.me, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folderName', S3Folder.AVATARS)

    return apiJson<{ key: string }>(ApiRoutes.s3.uploadFile, {
      method: 'POST',
      body: formData,
    })
  },

  deleteFile(key: string) {
    return apiJson<void>(ApiRoutes.s3.deleteFile, {
      method: 'POST',
      body: JSON.stringify({ key }),
    })
  },

  requestPasswordChange() {
    return apiJson<{ message: string }>(ApiRoutes.auth.requestPasswordChange, {
      method: 'POST',
      body: '{}',
    })
  },
}
