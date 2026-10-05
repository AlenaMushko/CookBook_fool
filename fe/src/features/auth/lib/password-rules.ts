export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/

export type PasswordRuleState = {
  minLength: boolean
  uppercase: boolean
  number: boolean
}

export function getPasswordRuleState(password: string): PasswordRuleState {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  }
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
