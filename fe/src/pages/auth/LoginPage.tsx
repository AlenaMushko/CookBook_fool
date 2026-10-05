import { useTranslation } from 'react-i18next'

import { AuthSplitLayout } from '@pages/auth/AuthSplitLayout'
import { LoginForm } from '@features/auth/components/LoginForm'

import loginIllustration from '@/assets/images/login-illustration.webp'

type LoginPageProps = {
  redirect?: string
}

export const LoginPage = ({ redirect }: LoginPageProps) => {
  const { t } = useTranslation()

  return (
    <AuthSplitLayout illustration={loginIllustration}>
      <p className="text-label font-semibold uppercase tracking-[0.24em] text-brand">
        {t('auth.login.eyebrow')}
      </p>

      <h1 className="mt-4 font-heading text-h2 text-foreground md:text-h1">
        {t('auth.login.title')}
      </h1>

      <p className="mt-3 text-body-large text-muted-foreground">
        {t('auth.login.description')}
      </p>

      <div className="mt-8 md:mt-10">
        <LoginForm redirectTo={redirect} />
      </div>
    </AuthSplitLayout>
  )
}
