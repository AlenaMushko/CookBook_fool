import { Link } from '@tanstack/react-router'
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { FieldError } from '@components/ui/field'
import { FormFieldInput } from '@components/ui/form-field-input'
import { URLS } from '@constants/url'

import { ApiError } from '@api/client'

import { authApi } from '../api/auth.api'
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '../schemas/reset-password.schema'

type ResetPasswordFormProps = {
  token: string
  onLinkInvalid?: () => void
  onLinkExpired?: () => void
}

export const ResetPasswordForm = ({
  token,
  onLinkInvalid,
  onLinkExpired,
}: ResetPasswordFormProps) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')

    try {
      await authApi.resetPassword({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })

      setIsSuccess(true)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH_TOKEN_EXPIRED') {
          onLinkExpired?.()
          return
        }

        if (
          error.code === 'AUTH_RESET_LINK_INVALID' ||
          error.status === 400 ||
          error.status === 401
        ) {
          onLinkInvalid?.()
          return
        }
      }

      setError('root', {
        message:
          error instanceof Error ? error.message : t('error.serverError'),
      })
    }
  })

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-success-bg text-success">
          <Check aria-hidden="true" className="size-6" strokeWidth={2} />
        </div>

        <h2 className="mt-6 font-heading text-h3 text-foreground">
          {t('auth.resetPassword.successTitle')}
        </h2>

        <p className="mt-3 text-body-large text-muted-foreground">
          {t('auth.resetPassword.successDescription')}
        </p>

        <Link
          to={URLS.LOGIN}
          className="mt-8 text-body font-medium text-brand underline-offset-4 hover:text-brand-active hover:underline"
        >
          {t('auth.resetPassword.continueToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FormFieldInput
        id="reset-password"
        label={t('auth.resetPassword.newPassword')}
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder={t('auth.resetPassword.passwordPlaceholder')}
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
        id="reset-password-confirm"
        label={t('auth.resetPassword.confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
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
        loadingText={t('auth.resetPassword.submitting')}
      >
        {t('auth.resetPassword.submit')}
      </Button>

      <Link
        to={URLS.LOGIN}
        className="inline-flex min-h-11 items-center gap-2 text-body font-medium text-outline-foreground underline-offset-4 hover:text-primary-hover hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        {t('auth.resetPassword.backToLogin')}
      </Link>
    </form>
  )
}
