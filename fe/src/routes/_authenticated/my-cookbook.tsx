import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-cookbook')({
  component: MyCookbookPage,
})

function MyCookbookPage() {
  return <div>My Cookbook</div>
}
