import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ErrorPage, NotFoundPage } from '@pages/errors'
import { AppProviders } from '@/providers'
import { queryClient } from '@api/queryClient'

import "@fontsource-variable/manrope"
import "@fontsource-variable/source-serif-4"

import { routeTree } from './routeTree.gen'
import './index.css'
import './i18n'

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: {
      user: null,
      isAuthenticated: false,
    },
  },
  defaultErrorComponent: ErrorPage,
  defaultNotFoundComponent: NotFoundPage,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
