
export function resolveMediaUrl(
  keyOrUrl: string | null | undefined,
  signedUrl?: string | null,
): string | null {
  if (signedUrl) return signedUrl
  if (!keyOrUrl) return null
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl
  return null
}
