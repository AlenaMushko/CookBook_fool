import { LocalStorageKey } from '@constants/localStorage'

export function getLocalStorage(key: LocalStorageKey): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setLocalStorage(key: LocalStorageKey, value: string): void {
  localStorage.setItem(key, value)
}

export function removeLocalStorage(key: LocalStorageKey): void {
  localStorage.removeItem(key)
}
