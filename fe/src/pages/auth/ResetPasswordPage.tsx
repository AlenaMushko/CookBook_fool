import { Link, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthSplitLayout } from '@pages/auth/AuthSplitLayout'
import { authApi } from '@features/auth/api/auth.api'
import { ResetPasswordForm } from '@features/auth/components/ResetPasswordForm'
import { URLS } from '@constants/url'

import resetPasswordIllustration from '@/assets/images/reset-password.webp'

type LinkStatus = 'checking' | 'valid' | 'expired' | 'invalid'

export const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const search = useSearch({ from: '/(public)/reset-password' })
  const token = search.token

  const [linkStatus, setLinkStatus] = useState<LinkStatus>(() =>
    token ? 'checking' : 'invalid',
  )

  useEffect(() => {
    if (!token) {
      setLinkStatus('invalid')
      return
    }

    let cancelled = false
    setLinkStatus('checking')

    void authApi
      .validateResetPassword(token)
      .then((result) => {
        if (cancelled) return
        setLinkStatus(result.status)
      })
      .catch(() => {
        if (cancelled) return
        setLinkStatus('invalid')
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const messageKey =
    linkStatus === 'expired'
      ? 'auth.resetPassword.expiredLink'
      : !token
        ? 'auth.resetPassword.invalidLink'
        : 'auth.resetPassword.usedLink'

  const showFormHeader = linkStatus === 'checking' || linkStatus === 'valid'

  return (
    <AuthSplitLayout illustration={resetPasswordIllustration}>
      <Link
        to={URLS.LOGIN}
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-body font-medium text-outline-foreground underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        {t('auth.resetPassword.backToLogin')}
      </Link>

      {showFormHeader ? (
        <>
          <p className="text-label font-semibold uppercase tracking-[0.24em] text-brand">
            {t('auth.resetPassword.eyebrow')}
          </p>

          <h1 className="mt-4 font-heading text-h2 text-foreground md:text-h1">
            {t('auth.resetPassword.title')}
          </h1>
        </>
      ) : null}

      {linkStatus === 'checking' ? (
        <p className="mt-3 text-body-large text-muted-foreground">
          {t('auth.resetPassword.checkingLink')}
        </p>
      ) : linkStatus === 'valid' && token ? (
        <>
          <p className="mt-3 text-body-large text-muted-foreground">
            {t('auth.resetPassword.description')}
          </p>

          <div className="mt-8 md:mt-10">
            <ResetPasswordForm
              token={token}
              onLinkInvalid={() => setLinkStatus('invalid')}
              onLinkExpired={() => setLinkStatus('expired')}
            />
          </div>
        </>
      ) : (
        <>
          <p className="text-body-large text-muted-foreground">
            {t(messageKey)}
          </p>

          <div className="mt-8 flex flex-col gap-4 md:mt-10">
            <Link
              to={URLS.FORGOT_PASSWORD}
              className="inline-flex min-h-11 items-center text-body font-medium text-brand underline-offset-4 hover:underline"
            >
              {t('auth.resetPassword.requestNewLink')}
            </Link>

            <Link
              to={URLS.LOGIN}
              className="inline-flex min-h-11 items-center text-body font-medium text-outline-foreground underline-offset-4 hover:text-primary-hover hover:underline"
            >
              {t('auth.resetPassword.continueToLogin')}
            </Link>
          </div>
        </>
      )}
    </AuthSplitLayout>
  )
}
