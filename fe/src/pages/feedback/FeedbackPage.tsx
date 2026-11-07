import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Heart, Lock, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { feedbackApi } from '@/features/feedback/api/feedback.api'
import { showToast } from '@/lib/toast'

export const FeedbackPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const canSend = message.trim().length > 0 && !sending

  const submit = async () => {
    if (!canSend) return
    setSending(true)
    try {
      await feedbackApi.send(message.trim())
      showToast(t('feedback.sent'), 'success', 5000)
      await navigate({ to: Routes.HOME })
    } catch {
      setSending(false)
      showToast(t('error.serverError'), 'error')
    }
  }

  return (
    <div className="relative -m-5 flex min-h-[calc(100svh-8rem)] flex-col overflow-hidden px-5 py-6 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-[#e7f0df] max-md:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-24 size-80 rounded-full bg-[#e7f0df] max-md:hidden"
      />

      <Link
        to={Routes.HOME}
        className="relative z-10 inline-flex w-fit items-center gap-1 text-[14px] text-foreground"
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
        {t('feedback.back')}
      </Link>

      <form
        className="relative z-10 mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center pt-8 md:pt-14"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <div className="relative mb-5 h-[72px] w-[88px] text-[#c4a574]" aria-hidden>
          <MessageCircle className="absolute top-3 left-0 size-12" strokeWidth={1.4} />
          <MessageCircle
            className="absolute top-0 right-0 size-11 fill-background"
            strokeWidth={1.4}
          />
          <Heart className="absolute top-3.5 right-3.5 size-4 fill-[#e7a0a8] text-[#e7a0a8]" />
        </div>

        <h1 className="text-center font-serif text-[32px] leading-10 font-semibold text-foreground md:text-[36px]">
          {t('feedback.title')}
        </h1>
        <p className="mt-3 max-w-[440px] text-center text-[15px] leading-6 text-subtle">
          {t('feedback.description')}
        </p>

        <p className="mt-6 flex w-full items-start gap-2.5 rounded-xl bg-primary px-4 py-3.5 text-[15px] leading-6 text-primary-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {t('feedback.confidential')}
        </p>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={2000}
          placeholder={t('feedback.placeholder')}
          aria-label={t('feedback.placeholder')}
          disabled={sending}
          className="mt-4 min-h-36 w-full resize-none rounded-xl border border-secondary-border bg-card px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-subtle focus-visible:border-primary disabled:opacity-70"
        />

        <Button
          type="submit"
          size="lg"
          className="mt-4 w-full"
          disabled={!canSend}
          isLoading={sending}
          loadingText={t('feedback.sending')}
        >
          <Send className="size-4" strokeWidth={1.5} />
          {t('feedback.send')}
        </Button>

        <p className="mt-5 inline-flex items-center gap-1.5 text-[15px] text-foreground">
          {t('feedback.thanks')}
          <Heart className="size-4 fill-success text-success" strokeWidth={1.5} />
        </p>
      </form>
    </div>
  )
}
