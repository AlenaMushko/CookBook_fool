import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { signOut } from '@/features/auth/lib/sign-out'
import { cn } from '@/lib/utils'

import { desktopNavItems, isPathActive } from './nav-items'

const SIDEBAR_STORAGE_KEY = 'cookbook.sidebar.expanded'

export const DesktopSidebar = () => {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored === '0') setExpanded(false)
      else if (stored === '1') setExpanded(true)
      else if (window.matchMedia('(max-width: 1023px)').matches) {
        setExpanded(false)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const ToggleIcon = expanded ? PanelLeftClose : PanelLeftOpen

  return (
    <aside
      aria-label={t('nav.sidebar')}
      data-expanded={expanded ? 'true' : 'false'}
      className={cn(
        'relative sticky top-0 z-30 hidden min-h-0 shrink-0 flex-col self-stretch border-r-[0.75px] border-secondary-border bg-background md:flex',
        'transition-[width] duration-200 ease-out',
        expanded ? 'w-max' : 'w-14',
      )}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-label={expanded ? t('nav.collapse') : t('nav.expand')}
        className={cn(
          'absolute top-5 -right-3 z-40 flex size-7 items-center justify-center rounded-md',
          'border border-secondary-border bg-card text-muted-foreground shadow-subtle',
          'transition-colors hover:border-primary hover:text-primary',
        )}
      >
        <ToggleIcon className="size-3.5" strokeWidth={1.6} aria-hidden />
      </button>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-2.5 pt-12 pb-2">
        <ul className="flex w-max min-w-full flex-col gap-1.5">
          {desktopNavItems.map(({ to, labelKey, icon: Icon, exact }) => {
            const isActive = isPathActive(pathname, to, exact)
            const label = t(labelKey)

            return (
              <li key={to} className="w-full">
                <Link
                  to={to}
                  title={expanded ? undefined : label}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={expanded ? undefined : label}
                  className={cn(
                    'group flex h-10 w-full items-center rounded-[7px] font-sans text-[13px] whitespace-nowrap transition-colors',
                    expanded ? 'gap-2.5 px-2.5' : 'justify-center px-0',
                    isActive
                      ? cn(
                          'border-l-[3px] border-l-primary bg-card font-semibold text-primary',
                          'shadow-[0_1px_4px_rgb(43_38_32/0.1)]',
                          expanded && 'pl-[7px]',
                        )
                      : 'border border-transparent font-medium text-muted-foreground hover:border-primary hover:bg-card hover:text-primary',
                  )}
                >
                  <Icon
                    className="size-[17px] shrink-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {expanded ? <span>{label}</span> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t-[0.75px] border-secondary-border px-2.5 py-4">
        <button
          type="button"
          onClick={() => void signOut()}
          title={expanded ? undefined : t('logout')}
          aria-label={expanded ? undefined : t('logout')}
          className={cn(
            'flex h-10 w-full items-center rounded-[7px] border border-transparent font-sans text-[13px] font-medium whitespace-nowrap text-brand',
            'transition-colors hover:border-brand hover:bg-brand-soft',
            expanded ? 'gap-2.5 px-2.5' : 'justify-center',
          )}
        >
          <LogOut className="size-[17px] shrink-0" strokeWidth={1.4} aria-hidden />
          {expanded ? <span>{t('logout')}</span> : null}
        </button>
      </div>
    </aside>
  )
}
