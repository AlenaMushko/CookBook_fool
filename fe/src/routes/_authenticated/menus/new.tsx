import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menus/new')({
  component: NewMenuPage,
})

function NewMenuPage() {
  return <div>New Menu</div>
}
