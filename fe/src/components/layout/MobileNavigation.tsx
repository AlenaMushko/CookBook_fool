import { Link, useRouterState } from '@tanstack/react-router'
import { BookOpen, CirclePlus, LayoutList, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'

import { Routes } from '@constants/routes'
import { useAuthSession } from '@/hooks/useAuthSession'
import { clearAuthSessionCookie } from '@/lib/auth-session'
import { cn } from '@/lib/utils'
import { API_URL, URLS } from '@constants/url'

type NavItem = {
  to: string
  labelKey: string
  icon: LucideIcon
  exact?: boolean
}

const navItems: NavItem[] = [
  { to: Routes.MY_COOKBOOK, labelKey: 'nav.myCookbook', icon: BookOpen },
  { to: Routes.MENUS, labelKey: 'nav.myMenus', icon: LayoutList },
  {
    to: Routes.RECIPE_NEW,
    labelKey: 'nav.createRecipe',
    icon: CirclePlus,
    exact: true,
  },
]

function isPathActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export const MobileNavigation = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthSession()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (!isAuthenticated) return null

  async function logout() {
    try {
      await fetch(`${API_URL}${URLS.AUTH}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      clearAuthSessionCookie()
    }
  }

  return (
    <>
      <div
        className="h-[5.5rem] shrink-0 md:hidden"
        aria-hidden="true"
      />
      <nav
        aria-label={t('nav.mobile')}
        className="fixed inset-x-0 bottom-0 z-40 border-t-[0.75px] border-secondary-border bg-card md:hidden"
      >
        <ul className="mx-auto flex max-w-page items-center justify-around gap-1 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {navItems.map(({ to, labelKey, icon: Icon, exact }) => {
            const isActive = isPathActive(pathname, to, exact)
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-md px-1 py-2',
                    'font-sans text-[11px] leading-[1.2] font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-brand',
                  )}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={1.5} />
                  <span className="text-center">{t(labelKey)}</span>
                </Link>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => void logout()}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-1 rounded-md px-2 py-2',
                'font-sans text-[11px] leading-[1.2] font-medium text-muted-foreground',
                'transition-colors hover:text-brand',
              )}
            >
              <LogOut className="size-5 shrink-0" strokeWidth={1.5} />
              <span className="text-center">{t('logout')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
