import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

import { LOGIN_EMAIL_REGEX } from './shared'

export type ForgotPasswordFormValues = {
  email: string
}

export function createForgotPasswordSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
      .regex(LOGIN_EMAIL_REGEX, { message: t(TEXT.ERROR.AUTH.INVALID_EMAIL) }),
  }) satisfies z.ZodType<ForgotPasswordFormValues>
}
