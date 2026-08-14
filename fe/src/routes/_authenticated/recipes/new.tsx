import { createFileRoute } from '@tanstack/react-router'
import { CreateRecipePage } from '@pages/recipes'

export const Route = createFileRoute('/_authenticated/recipes/new')({
  component: CreateRecipePage,
})
