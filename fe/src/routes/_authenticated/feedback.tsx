import { createFileRoute } from '@tanstack/react-router'

import { FeedbackPage } from '@pages/feedback'

export const Route = createFileRoute('/_authenticated/feedback')({
  component: FeedbackPage,
})
