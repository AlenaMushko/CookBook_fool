import { Link } from '@tanstack/react-router'
import { ArrowLeft, Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { FormFieldInput } from '@components/ui/form-field-input'
import { URLS } from '@constants/url'
import { showToast } from '@/lib/toast'

import { authApi } from '../api/auth.api'
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas/forgot-password.schema'

export const ForgotPasswordForm = () => {
  const { t } = useTranslation()
  const [isSent, setIsSent] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authApi.forgotPassword(values.email)
    } catch {
    } finally {
      setIsSent(true)
    }
  })

  const handleResend = async () => {
    const email = getValues('email').trim()
    if (!email || isResending) return

    setIsResending(true)
    try {
      await authApi.forgotPassword(email)
    } catch {
    } finally {
      setIsResending(false)
      showToast(t('auth.forgotPassword.success'), 'success')
    }
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-success-bg text-success">
          <Mail aria-hidden="true" className="size-6" strokeWidth={1.8} />
        </div>

        <h2 className="mt-6 font-heading text-h3 text-foreground">
          {t('auth.forgotPassword.successTitle')}
        </h2>

        <p className="mt-3 text-body-large text-muted-foreground">
          {t('auth.forgotPassword.successDescription')}
        </p>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-8 w-full"
          isLoading={isResending}
          loadingText={t('auth.forgotPassword.submitting')}
          onClick={() => void handleResend()}
        >
          {t('auth.forgotPassword.resend')}
        </Button>

        <p className="mt-6 text-body-small text-muted-foreground">
          {t('auth.forgotPassword.spamHint')}
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FormFieldInput
        id="forgot-password-email"
        label={t('user.email')}
        type="email"
        autoComplete="email"
        placeholder={t('auth.login.emailPlaceholder')}
        error={errors.email?.message}
        disabled={isSubmitting}
        required
        {...register('email')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        loadingText={t('auth.forgotPassword.submitting')}
      >
        {t('auth.forgotPassword.submit')}
      </Button>
    </form>
  )
}

export const ForgotPasswordBackLink = () => {
  const { t } = useTranslation()

  return (
    <Link
      to={URLS.LOGIN}
      className="mb-6 inline-flex min-h-11 items-center gap-2 text-body font-medium text-outline-foreground underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
    >
      <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
      {t('auth.forgotPassword.backToLogin')}
    </Link>
  )
}
