import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

import { LOGIN_EMAIL_REGEX } from './shared'

export type LoginFormValues = {
  email: string
  password: string
}

export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
      .regex(LOGIN_EMAIL_REGEX, { message: t(TEXT.ERROR.AUTH.INVALID_EMAIL) }),
    password: z.string().min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) }),
  }) satisfies z.ZodType<LoginFormValues>
}

export { LOGIN_EMAIL_REGEX } from './shared'
