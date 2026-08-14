import { Outlet } from '@tanstack/react-router'

export function AppLayout() {
  return (
    <div>
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
