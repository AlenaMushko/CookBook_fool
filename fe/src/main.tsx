import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ErrorPage, NotFoundPage } from '@pages/errors'
import { AppProviders } from '@/providers'
import { routeTree } from './routeTree.gen'
import './index.css'
import './i18n'

const router = createRouter({
  routeTree,
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
