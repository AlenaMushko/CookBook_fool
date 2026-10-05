import { createFileRoute, useRouter } from '@tanstack/react-router'

import { ErrorPage } from '@pages/errors'

export const Route = createFileRoute('/(public)/error')({
  component: ErrorRoutePage,
})

function ErrorRoutePage() {
  const router = useRouter()

  return (
    <ErrorPage
      error={new Error('Something went wrong')}
      reset={() => {
        void router.invalidate()
      }}
    />
  )
}
