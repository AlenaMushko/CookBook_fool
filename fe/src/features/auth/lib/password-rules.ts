export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
