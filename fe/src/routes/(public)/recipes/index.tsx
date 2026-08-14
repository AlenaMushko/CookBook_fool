import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/recipes/')({
  component: RecipesPage,
})

function RecipesPage() {
  return <div>Recipes</div>
}
