import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return <div>Reset Password</div>
}
