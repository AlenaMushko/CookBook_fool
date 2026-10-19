import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

import type { AuthUser } from '../types/auth.types'

type AuthSessionResponse = {
  user: AuthUser
}

export const authApi = {
  signIn(payload: { email: string; password: string; deviceId: string }) {
    return apiJson<AuthSessionResponse>(ApiRoutes.auth.signIn, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuthRefresh: true,
    })
  },

  signUp(payload: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    deviceId: string
  }) {
    return apiJson<AuthSessionResponse>(ApiRoutes.auth.signUp, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuthRefresh: true,
    })
  },

  forgotPassword(email: string) {
    return apiJson<{ message: string }>(ApiRoutes.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      skipAuthRefresh: true,
    })
  },

  validateResetPassword(token: string) {
    const query = new URLSearchParams({ token })
    return apiJson<{ status: 'valid' | 'expired' | 'invalid' }>(
      `${ApiRoutes.auth.validateResetPassword}?${query.toString()}`,
      {
        method: 'GET',
        skipAuthRefresh: true,
      },
    )
  },

  resetPassword(payload: {
    token: string
    password: string
    confirmPassword: string
  }) {
    return apiJson<void>(ApiRoutes.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuthRefresh: true,
    })
  },

  refresh() {
    return apiJson<{ success: boolean }>(ApiRoutes.auth.refresh, {
      method: 'POST',
      body: '{}',
      skipAuthRefresh: true,
    })
  },

  logout() {
    return apiJson<void>(ApiRoutes.auth.logout, {
      method: 'POST',
      body: '{}',
    })
  },
}
