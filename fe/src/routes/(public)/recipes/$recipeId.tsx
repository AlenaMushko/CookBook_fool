import { createFileRoute } from '@tanstack/react-router'
import { RecipeDetailsPage } from '@pages/recipes'

export const Route = createFileRoute('/(public)/recipes/$recipeId')({
  component: RecipeDetailsRoute,
})

function RecipeDetailsRoute() {
  const { recipeId } = Route.useParams()
  return <RecipeDetailsPage recipeId={recipeId} />
}
