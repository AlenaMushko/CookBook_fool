export type ResetPasswordSearch = {
  token?: string
}

export function parseResetPasswordSearch(
  search: Record<string, unknown>,
): ResetPasswordSearch {
  const token = typeof search.token === 'string' ? search.token.trim() : ''
  return token ? { token } : {}
}
