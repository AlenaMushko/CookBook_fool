import { Link, useRouterState } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { URLS } from '@constants/url'
import { Logo } from '@components/common/Logo'
import { LanguageSwitcher } from '@components/common/LanguageSwitcher'
import { NavButtonLink } from '@components/layout/NavButtonLink'
import { UserMenu } from '@components/layout/UserMenu'
import { Routes } from '@constants/routes'
import { signOut } from '@/features/auth/lib/sign-out'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { cn } from '@/lib/utils'

export const Header = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user, isLoading } = useCurrentUser()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const feedbackActive = pathname === Routes.FEEDBACK

  return (
    <nav className="flex w-full min-w-0 items-center justify-between gap-3 overflow-x-clip border-b-[0.75px] border-secondary-border bg-card px-4 py-2.5 sm:px-7">
      <Logo />
      <ul className="flex min-w-0 items-center gap-2">
        <li>
          <LanguageSwitcher />
        </li>

        <li className="md:hidden">
          <Link
            to={Routes.FEEDBACK}
            title={t('feedback.give')}
            aria-label={t('feedback.give')}
            aria-current={feedbackActive ? 'page' : undefined}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-full border',
              feedbackActive
                ? 'border-success bg-success-bg text-success'
                : 'border-success-border bg-success-bg text-success',
            )}
          >
            <MessageCircle className="size-[17px]" strokeWidth={1.5} aria-hidden />
          </Link>
        </li>
        {isAuthenticated ? (
          <li>
            <UserMenu
              user={user}
              isLoading={isLoading}
              onSignOut={() => void signOut()}
            />
          </li>
        ) : (
          <>
            <li>
              <NavButtonLink to={URLS.LOGIN} text={t('login')} />
            </li>
            <li className="max-[480px]:hidden">
              <NavButtonLink to={URLS.REGISTER} text={t('signup')} />
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
