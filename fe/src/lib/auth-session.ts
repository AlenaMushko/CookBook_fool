export const AUTH_COOKIES = {
  SESSION: 'hasSession',
} as const

export const AUTH_CHANGED_EVENT = 'auth:changed'

export function hasAuthSession(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie
    .split(';')
    .some((part) => part.trim().startsWith(`${AUTH_COOKIES.SESSION}=`))
}

export function notifyAuthChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function clearAuthSessionCookie(): void {
  document.cookie = `${AUTH_COOKIES.SESSION}=; Max-Age=0; path=/; SameSite=Strict`
  notifyAuthChanged()
}
