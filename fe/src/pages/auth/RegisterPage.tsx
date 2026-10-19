import { useTranslation } from 'react-i18next'

import { AuthSplitLayout } from '@pages/auth/AuthSplitLayout'
import { RegisterForm } from '@features/auth/components/RegisterForm'

import registerIllustration from '@/assets/images/register-illustration.webp'

export const RegisterPage = () => {
  const { t } = useTranslation()

  return (
    <AuthSplitLayout illustration={registerIllustration}>
      <p className="text-label font-semibold uppercase tracking-[0.24em] text-brand">
        {t('auth.register.eyebrow')}
      </p>

      <h1 className="mt-4 font-heading text-h2 text-foreground md:text-h1">
        {t('auth.register.title')}
      </h1>

      <p className="mt-3 text-body-large text-muted-foreground">
        {t('auth.register.description')}
      </p>

      <div className="mt-8 md:mt-10">
        <RegisterForm />
      </div>
    </AuthSplitLayout>
  )
}
