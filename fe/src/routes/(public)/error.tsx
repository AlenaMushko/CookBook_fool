import { createFileRoute } from '@tanstack/react-router'

import { ErrorPage } from '@pages/errors'

export const Route = createFileRoute('/(public)/error')({
  component: ErrorRoutePage,
})

function ErrorRoutePage() {
  return <ErrorPage error={new Error('Something went wrong')} reset={() => undefined} />
}
