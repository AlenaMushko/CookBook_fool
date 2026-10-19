import { Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@api/queryClient'
import { Button } from '@components/ui/button'
import { FieldError } from '@components/ui/field'
import { FormFieldInput } from '@components/ui/form-field-input'
import { URLS } from '@constants/url'
import { profileQueryKeys } from '@/features/profile/api/profile.queries'
import { notifyAuthChanged } from '@/lib/auth-session'
import { getDeviceId } from '@/lib/device'

import { authApi } from '../api/auth.api'
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '../schemas/register.schema'

export const RegisterForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerSchema = useMemo(() => createRegisterSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { user } = await authApi.signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        deviceId: getDeviceId(),
      })

      queryClient.setQueryData(profileQueryKeys.me(), user)
      await queryClient.invalidateQueries({ queryKey: profileQueryKeys.me() })
      notifyAuthChanged()
      void navigate({ to: URLS.MY_COOKBOOK })
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error ? error.message : t('error.serverError'),
      })
    }
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FormFieldInput
        id="register-first-name"
        label={t('user.firstName')}
        type="text"
        autoComplete="given-name"
        placeholder={t('user.enterFirstName')}
        error={errors.firstName?.message}
        disabled={isSubmitting}
        required
        {...register('firstName')}
      />

      <FormFieldInput
        id="register-last-name"
        label={t('user.lastName')}
        type="text"
        autoComplete="family-name"
        placeholder={t('user.enterLastName')}
        error={errors.lastName?.message}
        disabled={isSubmitting}
        required
        {...register('lastName')}
      />

      <FormFieldInput
        id="register-email"
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
        id="register-password"
        label={t('user.password')}
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder={t('auth.register.passwordPlaceholder')}
        description={t('auth.register.passwordHint')}
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
        {...register('password')}
      />

      <FormFieldInput
        id="register-confirm-password"
        label={t('user.confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder={t('auth.register.confirmPasswordPlaceholder')}
        error={errors.confirmPassword?.message}
        disabled={isSubmitting}
        required
        endIcon={
          showConfirmPassword ? (
            <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.8} />
          ) : (
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.8} />
          )
        }
        endIconAriaLabel={
          showConfirmPassword
            ? t('auth.login.hidePassword')
            : t('auth.login.showPassword')
        }
        endIconPressed={showConfirmPassword}
        onEndIconClick={() => setShowConfirmPassword((current) => !current)}
        {...register('confirmPassword')}
      />

      {errors.root ? (
        <FieldError className="rounded-md border border-error-border bg-error-bg px-3 py-2">
          {errors.root.message}
        </FieldError>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        loadingText={t('auth.register.submitting')}
      >
        {t('auth.register.submit')}
      </Button>

      <p className="text-center text-body text-muted-foreground">
        {t('auth.register.hasAccount')}{' '}
        <Link
          to={URLS.LOGIN}
          className="font-medium text-brand underline-offset-4 hover:text-brand-active hover:underline"
        >
          {t('auth.register.logIn')}
        </Link>
      </p>
    </form>
  )
}
