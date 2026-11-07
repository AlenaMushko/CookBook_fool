import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@pages/home'
import { parseHomeSearch } from '@/features/home/home-search'

export const Route = createFileRoute('/(public)/')({
  validateSearch: parseHomeSearch,
  component: HomePage,
})
