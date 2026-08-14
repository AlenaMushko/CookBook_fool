import { createFileRoute } from '@tanstack/react-router'
import { RecipesPage } from '@pages/recipes'

export const Route = createFileRoute('/(public)/recipes/')({
  component: RecipesPage,
})
