import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@pages/auth'

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
})
