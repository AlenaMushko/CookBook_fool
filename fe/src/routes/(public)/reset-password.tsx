import { createFileRoute } from '@tanstack/react-router'

import { ResetPasswordPage } from '@pages/auth/ResetPasswordPage'
import { parseResetPasswordSearch } from '@/lib/reset-password-link'

export const Route = createFileRoute('/(public)/reset-password')({
  validateSearch: parseResetPasswordSearch,
  component: ResetPasswordPage,
})
