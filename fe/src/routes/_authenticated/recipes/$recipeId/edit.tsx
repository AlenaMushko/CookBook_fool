import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/recipes/$recipeId/edit')({
  component: EditRecipePage,
})

function EditRecipePage() {
  const { recipeId } = Route.useParams()
  return <div>Edit Recipe {recipeId}</div>
}
