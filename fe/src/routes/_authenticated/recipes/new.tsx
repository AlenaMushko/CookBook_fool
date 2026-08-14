import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/recipes/new')({
  component: NewRecipePage,
})

function NewRecipePage() {
  return <div>New Recipe</div>
}
