import { LocalStorageKey } from '@constants/localStorage'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/local-storage'

export const SHOPPING_CHECKS_TTL_MS = 60 * 60 * 1000

type ShoppingChecksEntry = {
  savedAt: number
  dishes: string
  ids: string[]
}

type ShoppingChecksStore = Record<string, ShoppingChecksEntry>

const isEntry = (value: unknown): value is ShoppingChecksEntry => {
  if (!value || typeof value !== 'object') return false
  const entry = value as ShoppingChecksEntry
  return (
    typeof entry.savedAt === 'number' &&
    Number.isFinite(entry.savedAt) &&
    typeof entry.dishes === 'string' &&
    Array.isArray(entry.ids) &&
    entry.ids.every((id) => typeof id === 'string')
  )
}

const readStore = (): ShoppingChecksStore => {
  const raw = getLocalStorage(LocalStorageKey.ShoppingChecks)
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const store: ShoppingChecksStore = {}
    for (const [menuId, entry] of Object.entries(parsed)) {
      if (isEntry(entry)) store[menuId] = entry
    }
    return store
  } catch {
    return {}
  }
}

const writeStore = (store: ShoppingChecksStore) => {
  try {
    if (Object.keys(store).length === 0) {
      removeLocalStorage(LocalStorageKey.ShoppingChecks)
      return
    }
    setLocalStorage(LocalStorageKey.ShoppingChecks, JSON.stringify(store))
  } catch {
    /* private mode or a full store */
  }
}

const freshStore = (store: ShoppingChecksStore, now: number) => {
  let dirty = false
  for (const [menuId, entry] of Object.entries(store)) {
    if (now - entry.savedAt > SHOPPING_CHECKS_TTL_MS) {
      delete store[menuId]
      dirty = true
    }
  }
  return dirty
}

export const readShoppingChecks = (
  menuId: string,
  dishesKey: string,
): Record<string, boolean> => {
  const store = readStore()
  const dirty = freshStore(store, Date.now())
  const entry = store[menuId]
  if (entry && entry.dishes !== dishesKey) {
    delete store[menuId]
    writeStore(store)
    return {}
  }
  if (dirty) writeStore(store)
  if (!entry || entry.dishes !== dishesKey) return {}
  return Object.fromEntries(entry.ids.map((id) => [id, true]))
}

export const writeShoppingChecks = (
  menuId: string,
  dishesKey: string,
  checked: Record<string, boolean>,
) => {
  const store = readStore()
  freshStore(store, Date.now())
  const ids = Object.entries(checked)
    .filter(([, on]) => on)
    .map(([id]) => id)
  if (ids.length === 0) delete store[menuId]
  else store[menuId] = { savedAt: Date.now(), dishes: dishesKey, ids }
  writeStore(store)
}
