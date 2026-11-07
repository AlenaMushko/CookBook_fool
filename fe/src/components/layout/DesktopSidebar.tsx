import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LogOut, MessageCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Routes } from '@constants/routes'
import { signOut } from '@/features/auth/lib/sign-out'
import { cn } from '@/lib/utils'

import { desktopNavItems, isPathActive } from './nav-items'

const SIDEBAR_STORAGE_KEY = 'cookbook.sidebar.expanded'
/** Icon rail when collapsed — Tailwind `w-14`. */
const COLLAPSED_WIDTH_PX = 48

export const DesktopSidebar = () => {
  const { t, i18n } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [expanded, setExpanded] = useState(true)
  const [fullWidth, setFullWidth] = useState(200)
  const contentRef = useRef<HTMLDivElement>(null)

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

  // Measure full content once — width never depends on collapsed clip.
  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return

    const measure = () => {
      const next = Math.ceil(node.scrollWidth)
      if (next > COLLAPSED_WIDTH_PX) setFullWidth(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [i18n.language, t])

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
  const width = expanded ? fullWidth : COLLAPSED_WIDTH_PX

  return (
    <div
      className="relative z-40 hidden min-h-0 self-stretch overflow-visible md:block"
      data-state={expanded ? 'expanded' : 'collapsed'}
      data-slot="desktop-sidebar"
    >
      <div
        aria-hidden
        className="h-full transition-[width] duration-300 ease-smooth"
        style={{ width }}
      />

      <aside
        aria-label={t('nav.sidebar')}
        className={cn(
          'absolute inset-y-0 left-0 z-30 flex h-full flex-col overflow-hidden',
          'border-r-[0.75px] border-secondary-border bg-sidebar',
          'transition-[width] duration-300 ease-smooth',
        )}
        style={{ width }}
      >
        {/* Content keeps full size; aside clips it while narrowing */}
        <div ref={contentRef} className="flex h-full w-max min-w-max flex-col">
          <nav className="flex flex-1 flex-col gap-1.5 px-2.5 pt-12 pb-2">
            <ul className="flex flex-col gap-1.5">
              {desktopNavItems.map(({ to, labelKey, icon: Icon, exact }) => {
                const isActive = isPathActive(pathname, to, exact)
                const label = t(labelKey)

                return (
                  <li key={to}>
                    <Link
                      to={to}
                      title={label}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={label}
                      className={cn(
                        'flex h-10 items-center gap-2.5 rounded-[7px] px-2.5 font-sans text-[13px] whitespace-nowrap',
                        'transition-[background-color,border-color,color] duration-200 ease-smooth',
                        isActive
                          ? 'border-l-[3px] border-l-primary bg-card pr-2.5 pl-[7px] font-semibold text-primary shadow-subtle'
                          : 'border border-transparent font-medium text-muted-foreground hover:border-primary hover:bg-card hover:text-primary',
                      )}
                    >
                      <Icon
                        className="size-[17px] shrink-0"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Link
              to={Routes.FEEDBACK}
              title={t('feedback.give')}
              aria-label={t('feedback.give')}
              aria-current={pathname === Routes.FEEDBACK ? 'page' : undefined}
              className={cn(
                'mt-3 inline-flex h-10 w-fit items-center gap-2 rounded-full border px-3',
                'font-sans text-[13px] font-medium whitespace-nowrap',
                'transition-[background-color,border-color] duration-200 ease-smooth',
                pathname === Routes.FEEDBACK
                  ? 'border-success bg-success-bg text-success'
                  : 'border-success-border bg-success-bg text-success hover:border-success',
              )}
            >
              <MessageCircle className="size-[17px] shrink-0" strokeWidth={1.5} aria-hidden />
              <span>{t('feedback.give')}</span>
            </Link>
          </nav>

          <div className="mt-auto border-t-[0.75px] border-secondary-border px-2.5 py-4">
            <button
              type="button"
              onClick={() => void signOut()}
              title={t('logout')}
              aria-label={t('logout')}
              className={cn(
                'flex h-10 items-center gap-2.5 rounded-[7px] border border-transparent px-2.5',
                'font-sans text-[13px] font-medium whitespace-nowrap text-brand',
                'transition-[background-color,border-color] duration-200 ease-smooth',
                'hover:border-brand hover:bg-brand-soft',
              )}
            >
              <LogOut
                className="size-[17px] shrink-0"
                strokeWidth={1.4}
                aria-hidden
              />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        aria-label={expanded ? t('nav.collapse') : t('nav.expand')}
        className={cn(
          'absolute top-5 z-50 flex size-7 -translate-x-1/2 items-center justify-center rounded-md cursor-pointer',
          'border border-secondary-border bg-card text-muted-foreground shadow-subtle',
          'transition-[color,border-color,transform,left] duration-300 ease-smooth',
          'hover:border-primary hover:text-primary active:scale-95',
        )}
        style={{ left: width }}
      >
        <ToggleIcon
          className={cn(
            'size-3.5 transition-transform duration-300 ease-smooth',
            !expanded && 'rotate-180',
          )}
          strokeWidth={1.6}
          aria-hidden
        />
      </button>
    </div>
  )
}
