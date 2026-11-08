import { useSyncExternalStore } from 'react'

import { queryClient } from '@api/queryClient'
import { LocalStorageKey } from '@constants/localStorage'
import { useAuthSession } from '@/hooks/useAuthSession'
import { AUTH_COOKIES, notifyAuthChanged } from '@/lib/auth-session'

import { abortInflightRequests, bumpSessionEpoch } from './inflight'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from './local-storage'

export const GUEST_VIEWER = 'guest'

const USER_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const listeners = new Set<() => void>()

type BrowserSession = {
  present: boolean
  userId: string | null
}

const readStoredUserId = (): string | null => {
  const value = getLocalStorage(LocalStorageKey.SessionUserId)
  return value && USER_ID.test(value) ? value.toLowerCase() : null
}

export function readBrowserSession(): BrowserSession {
  if (typeof document === 'undefined') return { present: false, userId: null }

  const prefix = `${AUTH_COOKIES.SESSION}=`
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (!trimmed.startsWith(prefix)) continue
    const value = decodeURIComponent(trimmed.slice(prefix.length))
    if (!value) return { present: false, userId: null }
    return {
      present: true,
      userId: USER_ID.test(value) ? value.toLowerCase() : null,
    }
  }

  return { present: false, userId: null }
}

let currentUserId = readStoredUserId()

const emit = () => {
  for (const listener of listeners) listener()
}

const persistUserId = (userId: string | null) => {
  if (userId) setLocalStorage(LocalStorageKey.SessionUserId, userId)
  else removeLocalStorage(LocalStorageKey.SessionUserId)
}

const resetMemoryCaches = () => {
  bumpSessionEpoch()
  abortInflightRequests()
  void queryClient.cancelQueries()
  queryClient.clear()
}

const replaceSessionUser = (userId: string | null) => {
  if (currentUserId === userId) return
  currentUserId = userId
  persistUserId(userId)
  resetMemoryCaches()
  emit()
  notifyAuthChanged()
}

export function getSessionUserId(): string | null {
  return currentUserId
}

export function sessionViewerKey(): string {
  return currentUserId ?? GUEST_VIEWER
}

export function subscribeSessionUser(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function beginAccountSwitch(): void {
  bumpSessionEpoch()
  abortInflightRequests()
}

export function adoptSessionUser(userId: string): void {
  if (!USER_ID.test(userId)) return
  replaceSessionUser(userId.toLowerCase())
}

export function clearSessionUser(): void {
  replaceSessionUser(null)
}

export function alignSessionWithCookie(): void {
  const cookie = readBrowserSession()
  if (!cookie.present) {
    clearSessionUser()
    return
  }
  if (cookie.userId) adoptSessionUser(cookie.userId)
}

const bootSessionUser = () => {
  const cookie = readBrowserSession()
  if (!cookie.present) {
    if (currentUserId !== null) {
      currentUserId = null
      persistUserId(null)
    }
    return
  }
  if (cookie.userId && cookie.userId !== currentUserId) {
    currentUserId = cookie.userId
    persistUserId(cookie.userId)
  }
}

const installSessionSync = () => {
  if (typeof window === 'undefined') return
  const flag = '__cookbookSessionSync'
  const root = window as Window & { [flag]?: boolean }
  if (root[flag]) return
  root[flag] = true

  window.addEventListener('storage', (event) => {
    if (event.key !== LocalStorageKey.SessionUserId) return
    window.location.reload()
  })
  window.addEventListener('focus', () => {
    alignSessionWithCookie()
  })
}

bootSessionUser()
installSessionSync()

export function useSessionUserId(): string | null {
  return useSyncExternalStore(subscribeSessionUser, getSessionUserId, () => null)
}

export function useViewerKey(): string | null {
  const userId = useSessionUserId()
  const { isAuthenticated } = useAuthSession()
  if (!isAuthenticated) return GUEST_VIEWER
  return userId
}
