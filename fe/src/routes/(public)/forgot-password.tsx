import { createFileRoute } from '@tanstack/react-router'

import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage'

export const Route = createFileRoute('/(public)/forgot-password')({
  component: ForgotPasswordPage,
})
