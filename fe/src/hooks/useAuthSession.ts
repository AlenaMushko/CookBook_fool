import { useSyncExternalStore } from 'react'

import {
  AUTH_CHANGED_EVENT,
  hasAuthSession,
} from '@/lib/auth-session'

function subscribe(onStoreChange: () => void) {
  window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange)
  window.addEventListener('focus', onStoreChange)
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange)
    window.removeEventListener('focus', onStoreChange)
  }
}

export function useAuthSession() {
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    hasAuthSession,
    () => false,
  )

  return { isAuthenticated }
}
