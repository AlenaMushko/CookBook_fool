function hasControlOrBackslash(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code <= 31 || code === 92 || code === 127) return true
  }
  return false
}

export function safeRedirectPath(
  value: unknown,
  origin?: string,
): string | undefined {
  if (typeof value !== 'string') return undefined

  const candidate = value.trim()
  if (!candidate || hasControlOrBackslash(candidate)) return undefined

  const base =
    origin ??
    (typeof window !== 'undefined' ? window.location.origin : undefined)
  if (!base) return undefined

  let url: URL
  try {
    url = new URL(candidate, base)
  } catch {
    return undefined
  }

  if (url.origin !== base) return undefined
  if (!url.pathname.startsWith('/') || url.pathname.startsWith('//')) {
    return undefined
  }

  return `${url.pathname}${url.search}`
}
