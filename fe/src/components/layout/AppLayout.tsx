import { Outlet } from "@tanstack/react-router";
import { Loader } from "@components/common";
import { Header } from "@components/layout/Header";
import { Footer } from "@components/layout/Footer";
import { MobileNavigation } from "@components/layout/MobileNavigation";
import { DesktopSidebar } from "@components/layout/DesktopSidebar";

export const AppLayout = () => {
  return (
    <div className='flex min-h-svh flex-col bg-background'>
      <Loader />
      <Header />

      <div className='flex min-h-0 min-w-0 flex-1'>
        <DesktopSidebar />

        <main className='flex min-w-0 flex-1 flex-col p-5'>
          <Outlet />
        </main>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
};
