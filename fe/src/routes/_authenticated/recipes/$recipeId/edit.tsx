import { createFileRoute } from '@tanstack/react-router'
import { EditRecipePage } from '@pages/recipes'

export const Route = createFileRoute('/_authenticated/recipes/$recipeId/edit')({
  component: EditRecipeRoute,
})

function EditRecipeRoute() {
  const { recipeId } = Route.useParams()
  return <EditRecipePage recipeId={recipeId} />
}
