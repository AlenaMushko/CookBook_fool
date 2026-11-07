import { createFileRoute } from '@tanstack/react-router'
import { MyCookbookPage } from '@pages/cookbook'
import { parseCookbookSearch } from '@/features/cookbook/list-search'

export const Route = createFileRoute('/_authenticated/my-cookbook')({
  validateSearch: parseCookbookSearch,
  component: MyCookbookPage,
})
