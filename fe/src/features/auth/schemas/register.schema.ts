import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

import { PASSWORD_REGEX } from '../lib/password-rules'
import { LOGIN_EMAIL_REGEX } from './shared'

const nameSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
    .min(3, { message: t(TEXT.ERROR.NAME_LENGTH) })
    .max(50, { message: t(TEXT.ERROR.NAME_LENGTH) })

export type RegisterFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function createRegisterSchema(t: TFunction) {
  return z
    .object({
      firstName: nameSchema(t),
      lastName: nameSchema(t),
      email: z
        .string()
        .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
        .regex(LOGIN_EMAIL_REGEX, {
          message: t(TEXT.ERROR.AUTH.INVALID_EMAIL),
        }),
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
    }) satisfies z.ZodType<RegisterFormValues>
}

export { LOGIN_EMAIL_REGEX as REGISTER_EMAIL_REGEX } from './shared'
