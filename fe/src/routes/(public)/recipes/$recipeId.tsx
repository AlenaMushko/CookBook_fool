import { createFileRoute } from '@tanstack/react-router'
import { RecipeDetailsPage } from '@pages/recipes'

import { requireAuthSession } from '@/lib/require-auth'

export const Route = createFileRoute('/(public)/recipes/$recipeId')({
  beforeLoad: ({ location }) => {
    requireAuthSession(location.href)
  },
  component: RecipeDetailsRoute,
})

function RecipeDetailsRoute() {
  const { recipeId } = Route.useParams()
  return <RecipeDetailsPage recipeId={recipeId} />
}
