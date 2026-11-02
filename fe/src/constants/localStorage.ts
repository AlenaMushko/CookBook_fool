/** Non-auth client data only. Auth tokens live in httpOnly cookies. */
export const LocalStorageKey = {
  DeviceId: 'deviceId',
  RecipeDraft: 'recipeDraft',
} as const

export type LocalStorageKey =
  (typeof LocalStorageKey)[keyof typeof LocalStorageKey]
