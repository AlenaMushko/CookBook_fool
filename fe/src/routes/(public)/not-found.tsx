import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@pages/errors'

export const Route = createFileRoute('/(public)/not-found')({
  component: NotFoundPage,
})
