import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menus/')({
  component: MenusPage,
})

function MenusPage() {
  return <div>Menus</div>
}
