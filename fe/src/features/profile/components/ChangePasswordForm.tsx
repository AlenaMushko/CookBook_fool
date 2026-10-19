import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { showToast } from '@/lib/toast'

import { profileApi } from '../api/profile.api'

export const ChangePasswordForm = () => {
  const { t } = useTranslation()
  const { user } = useCurrentUser()
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const onSend = async () => {
    setIsSending(true)
    try {
      const result = await profileApi.requestPasswordChange()
      setSent(true)
      showToast(result.message || t('user.checkEmail'), 'success')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl bg-card p-6 shadow-sm md:p-8">
      <h1 className="font-heading text-h2 text-foreground">
        {t('profilePage.changePassword')}
      </h1>

      <p className="text-body-large text-muted-foreground">
        {sent
          ? t('profilePage.passwordEmailSent', { email: user?.email ?? '' })
          : t('profilePage.confirmPasswordDescription', {
              email: user?.email ?? '',
            })}
      </p>

      {!sent ? (
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSending}
          loadingText={t('profilePage.sending')}
          onClick={() => void onSend()}
        >
          {t('profilePage.sendResetLink')}
        </Button>
      ) : null}

      <Link
        to={Routes.PROFILE}
        className="text-body font-medium text-brand underline-offset-4 hover:underline"
      >
        {t('profilePage.backToProfile')}
      </Link>
    </div>
  )
}
