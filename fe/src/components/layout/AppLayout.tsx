import { Outlet } from '@tanstack/react-router'
import { Loader } from '@components/common'

export const AppLayout = () => {
  return (
    <div>
      <Loader />
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
