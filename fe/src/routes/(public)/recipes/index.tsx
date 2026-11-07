import { createFileRoute } from '@tanstack/react-router'
import { RecipesPage } from '@pages/recipes'
import { parseCookbookSearch } from '@/features/cookbook/list-search'

export const Route = createFileRoute('/(public)/recipes/')({
  validateSearch: parseCookbookSearch,
  component: RecipesPage,
})
