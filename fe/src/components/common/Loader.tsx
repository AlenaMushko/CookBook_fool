import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

const MIN_VISIBLE_MS = 520

const isContentQuery = (queryKey: readonly unknown[]) => {
  const [root, second] = queryKey
  if (root === 'menus') return true
  if (root === 'measurement-units') return true
  if (root !== 'dishes') return false
  if (second === 'categories') return false
  return true
}

const PageMark = () => (
  <div className="relative size-[clamp(11rem,24vmin,20rem)]" aria-hidden>
    <div className="absolute inset-0 rounded-full bg-secondary shadow-[0_22px_60px_rgba(74,90,68,0.16)]" />
    <div
      className="absolute inset-[7%] animate-spin rounded-full"
      style={{
        background:
          'conic-gradient(from 0deg, transparent 0 55%, var(--primary) 82%, var(--primary-hover) 100%)',
        WebkitMask: 'radial-gradient(farthest-side, transparent 58%, #000 61%)',
        mask: 'radial-gradient(farthest-side, transparent 58%, #000 61%)',
      }}
    />
    <div className="absolute inset-[20%] rounded-full bg-background shadow-[inset_0_0_0_1.5px_var(--secondary-border)]" />
    <div
      className="absolute inset-[28%] animate-[spin_1.8s_linear_infinite_reverse] rounded-full"
      style={{
        background:
          'conic-gradient(from 40deg, transparent 0 48%, var(--brand-soft) 100%)',
        WebkitMask: 'radial-gradient(farthest-side, transparent 60%, #000 63%)',
        mask: 'radial-gradient(farthest-side, transparent 60%, #000 63%)',
      }}
    />
    <div className="absolute inset-[40%] flex items-center justify-center rounded-full bg-secondary">
      <svg
        viewBox="0 0 24 24"
        className="size-[58%] text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20c4-3 6-6.2 6-9.2A6 6 0 0 0 12 5a6 6 0 0 0-6 5.8C6 13.8 8 17 12 20Z" />
        <path d="M12 20V9" />
      </svg>
    </div>
  </div>
)

export const Loader = () => {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const listPage = useRouterState({
    select: (state) => {
      const search = state.location.search
      if (!search || typeof search !== 'object' || !('page' in search)) return 1
      const page = search.page
      return typeof page === 'number' && page > 1 ? page : 1
    },
  })
  const routerPending = useRouterState({ select: (state) => state.status === 'pending' })
  const pageFetches = useIsFetching({
    predicate: (query) => isContentQuery(query.queryKey),
  })
  const mutations = useIsMutating({
    predicate: (mutation) => mutation.options.meta?.skipGlobalLoader !== true,
  })
  const pending = routerPending || pageFetches > 0 || mutations > 0
  const pendingRef = useRef(pending)
  pendingRef.current = pending

  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    shownAt.current = Date.now()
    setVisible(true)
  }, [pathname, listPage])

  useEffect(() => {
    if (pending) {
      shownAt.current = Date.now()
      setVisible(true)
      return
    }

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current))
    const timer = window.setTimeout(() => {
      if (!pendingRef.current) setVisible(false)
    }, wait)
    return () => window.clearTimeout(timer)
  }, [pending, pathname, listPage])

  return (
    <div
      className={cn(
        'fixed inset-0 z-[1300] flex items-center justify-center bg-background/94 transition-opacity duration-200',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
    >
      <span className="sr-only">{t('loader.loading')}</span>
      <PageMark />
    </div>
  )
}
