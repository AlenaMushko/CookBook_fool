import { LocalStorageKey } from '@constants/localStorage'

import { getLocalStorage, removeLocalStorage, setLocalStorage } from './local-storage'

const VERSION = 1

type Envelope = {
  v: number
  byUser: Record<string, unknown>
}

const isEnvelope = (value: unknown): value is Envelope => {
  if (!value || typeof value !== 'object') return false
  const envelope = value as Envelope
  return envelope.v === VERSION && !!envelope.byUser && typeof envelope.byUser === 'object'
}

const readEnvelope = (key: LocalStorageKey): Envelope | null => {
  const raw = getLocalStorage(key)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isEnvelope(parsed)) return parsed
  } catch {
    // Legacy or corrupt payloads are dropped below.
  }

  removeLocalStorage(key)
  return null
}

const writeEnvelope = (key: LocalStorageKey, envelope: Envelope) => {
  if (Object.keys(envelope.byUser).length === 0) {
    removeLocalStorage(key)
    return
  }
  setLocalStorage(key, JSON.stringify(envelope))
}

export function readUserScoped<T>(
  key: LocalStorageKey,
  userId: string,
  parse: (value: unknown) => T | null,
): T | null {
  const envelope = readEnvelope(key)
  if (!envelope || !(userId in envelope.byUser)) return null

  const parsed = parse(envelope.byUser[userId])
  if (parsed != null) return parsed

  delete envelope.byUser[userId]
  writeEnvelope(key, envelope)
  return null
}

export function writeUserScoped(
  key: LocalStorageKey,
  userId: string,
  value: unknown,
): void {
  const envelope = readEnvelope(key) ?? { v: VERSION, byUser: {} }
  if (value === undefined) delete envelope.byUser[userId]
  else envelope.byUser[userId] = value
  writeEnvelope(key, envelope)
}
