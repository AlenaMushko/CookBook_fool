import { Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@api/queryClient'
import { Button } from '@components/ui/button'
import { FormFieldInput } from '@components/ui/form-field-input'
import { URLS } from '@constants/url'
import { profileQueryKeys } from '@/features/profile/api/profile.queries'
import { notifyAuthChanged } from '@/lib/auth-session'
import { getDeviceId } from '@/lib/device'
import { showToast } from '@/lib/toast'

import { authApi } from '../api/auth.api'
import {
  createLoginSchema,
  type LoginFormValues,
} from '../schemas/login.schema'

type LoginFormProps = {
  redirectTo?: string
}

export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { user } = await authApi.signIn({
        email: values.email.trim(),
        password: values.password,
        deviceId: getDeviceId(),
      })

      queryClient.setQueryData(profileQueryKeys.me(), user)
      notifyAuthChanged()
      showToast(t('auth.login.success'), 'success')

      if (redirectTo?.startsWith('/')) {
        window.location.assign(redirectTo)
        return
      }

      void navigate({ to: URLS.MY_COOKBOOK })
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    }
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FormFieldInput
        id="login-email"
        label={t('user.email')}
        type="email"
        autoComplete="email"
        placeholder={t('auth.login.emailPlaceholder')}
        error={errors.email?.message}
        disabled={isSubmitting}
        required
        {...register('email')}
      />

      <FormFieldInput
        id="login-password"
        label={t('user.password')}
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder={t('user.enterPassword')}
        error={errors.password?.message}
        disabled={isSubmitting}
        required
        endIcon={
          showPassword ? (
            <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.8} />
          ) : (
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.8} />
          )
        }
        endIconAriaLabel={
          showPassword
            ? t('auth.login.hidePassword')
            : t('auth.login.showPassword')
        }
        endIconPressed={showPassword}
        onEndIconClick={() => setShowPassword((current) => !current)}
        footer={
          <Link
            to={URLS.FORGOT_PASSWORD}
            className="mt-2 ml-auto block w-fit text-body-small text-muted-foreground underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
          >
            {t('forgot_password')}
          </Link>
        }
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        loadingText={t('auth.login.submitting')}
      >
        {t('login')}
      </Button>

      <p className="text-center text-body text-muted-foreground">
        {t('auth.login.noAccount')}{' '}
        <Link
          to={URLS.REGISTER}
          className="font-medium text-brand underline-offset-4 hover:text-brand-active hover:underline"
        >
          {t('auth.login.createAccount')}
        </Link>
      </p>
    </form>
  )
}
