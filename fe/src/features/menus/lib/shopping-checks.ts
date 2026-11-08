import { LocalStorageKey } from '@constants/localStorage'
import { getSessionUserId } from '@/lib/session-user'
import { readUserScoped, writeUserScoped } from '@/lib/user-scoped-storage'

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

const viewerKey = () => getSessionUserId() ?? 'guest'

const parseStore = (value: unknown): ShoppingChecksStore | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const store: ShoppingChecksStore = {}
  for (const [menuId, entry] of Object.entries(value)) {
    if (isEntry(entry)) store[menuId] = entry
  }
  return store
}

const readStore = (): ShoppingChecksStore =>
  readUserScoped(LocalStorageKey.ShoppingChecks, viewerKey(), parseStore) ?? {}

const writeStore = (store: ShoppingChecksStore) => {
  try {
    writeUserScoped(
      LocalStorageKey.ShoppingChecks,
      viewerKey(),
      Object.keys(store).length === 0 ? undefined : store,
    )
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
