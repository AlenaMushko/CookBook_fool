import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/recipes/$recipeId')({
  component: RecipePage,
})

function RecipePage() {
  const { recipeId } = Route.useParams()
  return <div>Recipe {recipeId}</div>
}
