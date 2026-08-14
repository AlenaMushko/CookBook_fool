import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '@pages/profile'

export const Route = createFileRoute('/_authenticated/change-password')({
  component: ChangePasswordPage,
})
