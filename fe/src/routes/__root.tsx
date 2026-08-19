import { createRootRouteWithContext } from '@tanstack/react-router'
import { AppLayout } from '@components/layout'
import { ErrorPage, NotFoundPage } from '@pages/errors'
import type { RouterContext } from '@/router-context'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})
