import { createFileRoute } from '@tanstack/react-router'
import { MyCookbookPage } from '@pages/cookbook'

export const Route = createFileRoute('/_authenticated/my-cookbook')({
  component: MyCookbookPage,
})
