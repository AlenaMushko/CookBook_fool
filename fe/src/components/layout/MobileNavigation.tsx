import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { signOut } from "@/features/auth/lib/sign-out";
import { useAuthSession } from "@/hooks/useAuthSession";
import { cn } from "@/lib/utils";

import { Routes } from "@constants/routes";

import { isPathActive, mobileNavItems } from "./nav-items";

const navItemClassName = (isActive: boolean, isDisabled: boolean) =>
  cn(
    "flex flex-col items-center justify-center gap-1 rounded-md px-1 py-2",
    "font-sans text-[11px] leading-[1.2] font-medium transition-colors",
    isDisabled
      ? "cursor-not-allowed text-disabled-foreground"
      : isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-brand"
  );

export const MobileNavigation = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div className='h-[5.5rem] shrink-0 md:hidden' aria-hidden='true' />
      <nav
        aria-label={t("nav.mobile")}
        className='fixed inset-x-0 bottom-0 z-40 w-full max-w-full overflow-x-clip border-t-[0.75px] border-secondary-border bg-background md:hidden'
      >
        <ul className='mx-auto flex max-w-page items-center justify-around gap-1 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
          {mobileNavItems.map(
            ({ to, labelKey, icon: Icon, exact, requiresAuth }) => {
              if (!isAuthenticated && to === Routes.RECIPE_NEW) return null;

              const locked = Boolean(requiresAuth) && !isAuthenticated;
              const isActive = !locked && isPathActive(pathname, to, exact);

              return (
                <li key={to} className='flex-1'>
                  {!locked ? (
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={navItemClassName(isActive, false)}
                    >
                      <Icon className='size-5 shrink-0' strokeWidth={1.5} />
                      <span className='text-center'>{t(labelKey)}</span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled='true'
                      className={navItemClassName(false, true)}
                    >
                      <Icon className='size-5 shrink-0' strokeWidth={1.5} />
                      <span className='text-center'>{t(labelKey)}</span>
                    </span>
                  )}
                </li>
              );
            }
          )}

          <li>
            {isAuthenticated ? (
              <button
                type='button'
                onClick={() => void signOut()}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 rounded-md px-2 py-2",
                  "font-sans text-[11px] leading-[1.2] font-medium text-muted-foreground",
                  "transition-colors hover:text-brand"
                )}
              >
                <LogOut className='size-5 shrink-0' strokeWidth={1.5} />
                <span className='text-center'>{t("logout")}</span>
              </button>
            ) : (
              <span
                aria-disabled='true'
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 rounded-md px-2 py-2",
                  "cursor-not-allowed font-sans text-[11px] leading-[1.2] font-medium text-disabled-foreground"
                )}
              >
                <LogOut className='size-5 shrink-0' strokeWidth={1.5} />
                <span className='text-center'>{t("logout")}</span>
              </span>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};
