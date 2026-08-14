import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({
  component: HomePage,
})

function HomePage() {
  return <div>Home</div>
}
