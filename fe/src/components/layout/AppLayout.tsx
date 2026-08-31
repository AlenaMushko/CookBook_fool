import { Outlet } from '@tanstack/react-router'
import { Loader } from '@components/common'
import { Header } from '@components/layout/Header'
import { Footer } from '@components/layout/Footer'
import { MobileNavigation } from '@components/layout/MobileNavigation'

export const AppLayout = () => {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Loader />
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  )
}
