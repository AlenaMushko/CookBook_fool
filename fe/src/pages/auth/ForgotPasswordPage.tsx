import { useTranslation } from 'react-i18next'

import { AuthSplitLayout } from '@pages/auth/AuthSplitLayout'
import {
  ForgotPasswordBackLink,
  ForgotPasswordForm,
} from '@features/auth/components/ForgotPasswordForm'

import forgotPasswordIllustration from '@/assets/images/forgot-password.webp'

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()

  return (
    <AuthSplitLayout illustration={forgotPasswordIllustration}>
      <ForgotPasswordBackLink />

      <p className="text-label font-semibold uppercase tracking-[0.24em] text-brand">
        {t('auth.forgotPassword.eyebrow')}
      </p>

      <h1 className="mt-4 font-heading text-h2 text-foreground md:text-h1">
        {t('auth.forgotPassword.title')}
      </h1>

      <p className="mt-3 text-body-large text-muted-foreground">
        {t('auth.forgotPassword.description')}
      </p>

      <div className="mt-8 md:mt-10">
        <ForgotPasswordForm />
      </div>
    </AuthSplitLayout>
  )
}
