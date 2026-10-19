import type { TFunction } from 'i18next'
import { z } from 'zod'

import { TEXT } from '@messages/validation'

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/

const nameSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, { message: t(TEXT.ERROR.REQUIRED_FIELD) })
    .min(3, { message: t(TEXT.ERROR.NAME_LENGTH) })
    .max(50, { message: t(TEXT.ERROR.NAME_LENGTH) })

export type ProfileFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export function createProfileSchema(t: TFunction) {
  return z.object({
    firstName: nameSchema(t),
    lastName: nameSchema(t),
    email: z.string(),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || PHONE_REGEX.test(value),
        { message: t(TEXT.ERROR.INVALID_PHONE) },
      ),
  }) satisfies z.ZodType<ProfileFormValues>
}
