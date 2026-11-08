import type { TFunction } from 'i18next'
import { z } from 'zod'

export const FEEDBACK_MESSAGE_MAX = 2000

export type FeedbackFormValues = {
  message: string
}

export function createFeedbackSchema(t: TFunction) {
  return z.object({
    message: z
      .string()
      .trim()
      .min(1, { message: t('feedback.required') })
      .max(FEEDBACK_MESSAGE_MAX, { message: t('feedback.tooLong') }),
  }) satisfies z.ZodType<FeedbackFormValues>
}
