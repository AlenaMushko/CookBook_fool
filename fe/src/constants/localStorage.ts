/** Non-auth client data only. Auth tokens live in httpOnly cookies. */
export const LocalStorageKey = {
  DeviceId: 'deviceId',
  SessionUserId: 'sessionUserId',
  RecipeDraft: 'recipeDraft',
  MenuDraft: 'menuDraft',
  ShoppingChecks: 'shoppingChecks',
} as const

export type LocalStorageKey =
  (typeof LocalStorageKey)[keyof typeof LocalStorageKey]
