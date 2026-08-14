import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/change-password')({
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  return <div>Change Password</div>
}
