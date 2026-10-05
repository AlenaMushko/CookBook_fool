import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

import { PASSWORD_REGEX } from '../lib/password-rules'

export type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}

export function createResetPasswordSchema(t: TFunction) {
  return z
    .object({
      password: z
        .string()
        .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
        .regex(PASSWORD_REGEX, {
          message: t(TEXT.ERROR.AUTH.PASSWORD_FORMAT),
        }),
      confirmPassword: z
        .string()
        .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(TEXT.ERROR.AUTH.PASSWORDS_MUST_MATCH),
      path: ['confirmPassword'],
    }) satisfies z.ZodType<ResetPasswordFormValues>
}
