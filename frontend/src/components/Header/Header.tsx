import AvatarMenu from "@components/Header/AvatarMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AppRoutes } from "@routing/appRoutes";
import { LanguageSwitcher } from "@shared/index";
import { useAppStore } from "@stores/zustandStore";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { t } = useTranslation();

  const { isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (route: string) => location.pathname === route;

  const pagesAuth = [
    { label: t("home"), route: AppRoutes.HOME },
    { label: t("login"), route: AppRoutes.SIGN_IN },
    { label: t("signup"), route: AppRoutes.SIGN_UP },
  ];

  const pagesUser = [
    { label: t("home"), route: AppRoutes.HOME },
    { label: t("dashboard"), route: AppRoutes.DASHBOARD },
  ];

  const pages = isAuthenticated ? pagesUser : pagesAuth;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavigate = (route: string) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <header className='absolute top-0 left-0 z-40 w-screen border-b border-border bg-card px-4 text-foreground'>
      <div className='mx-auto flex h-14 max-w-7xl items-center'>
        {/* Mobile menu */}
        <div className='flex flex-1 sm:hidden'>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon-lg'
                aria-label='Open navigation menu'
                className='text-foreground'
              >
                !!!
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64 bg-card p-0'>
              <SheetHeader className='border-b border-border'>
                <SheetTitle className='font-serif text-[19px] font-normal italic text-brand'>
                  Cookbook
                </SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-1 p-4'>
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    type='button'
                    variant='ghost'
                    className={cn(
                      "justify-start",
                      isActive(page.route)
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    onClick={() => handleNavigate(page.route)}
                  >
                    {page.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <RouterLink
          to={AppRoutes.HOME}
          aria-label='Cookbook home'
          className='flex-1 font-serif text-[19px] leading-[1.1] font-normal italic text-brand no-underline transition-colors duration-[120ms] ease-in hover:text-brand-pressed sm:mr-[22px] sm:flex-none'
        >
          Cookbook
        </RouterLink>

        <div className='ml-auto flex items-center justify-center gap-[2vw]'>
          <nav className='ml-auto hidden items-center gap-[2vw] sm:flex'>
            {pages.map((page) => (
              <Button
                key={page.label}
                type='button'
                variant='ghost'
                onClick={() => handleNavigate(page.route)}
                className={cn(
                  isActive(page.route)
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {page.label}
              </Button>
            ))}
          </nav>

          <LanguageSwitcher />

          {isAuthenticated ? <AvatarMenu /> : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
