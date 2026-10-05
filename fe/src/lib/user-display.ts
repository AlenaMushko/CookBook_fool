type NameParts = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export function getUserDisplayName({ firstName, lastName }: NameParts): string {
  return [firstName, lastName].filter(Boolean).join(' ').trim()
}

export function getUserInitials({
  firstName,
  lastName,
  email,
}: NameParts): string {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''
  const fromName = `${first}${last}`.toUpperCase()
  if (fromName) return fromName

  const fromEmail = email?.trim().charAt(0).toUpperCase() ?? ''
  return fromEmail
}
