import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  navButtonLinkVariants,
  PageSection,
  SIZES,
  VARIANTS,
} from '@components/layout'

import errorIllustration from '@/assets/images/error-page-illustration.png'
import { cn } from '@/lib/utils'

export function ErrorPage({ reset }: ErrorComponentProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back()
      return
    }

    void router.navigate({ to: '/' })
  }

  return (
    <PageSection centered className="bg-background">
      <div className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] md:gap-12 lg:gap-20">
        <div
          aria-hidden="true"
          className="mx-auto flex w-full max-w-[620px] items-center justify-center bg-background md:max-w-none"
        >
          <img
            src={errorIllustration}
            alt=""
            className="h-auto w-full object-contain"
            draggable={false}
          />
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-col items-start md:max-w-none">
          <p className="mb-4 text-label font-semibold uppercase tracking-[0.24em] text-brand md:mb-5">
            {t('errorPage.eyebrow')}
          </p>

          <h1 className="max-w-[500px] font-heading text-h1 text-foreground md:text-display">
            {t('errorPage.title')}
          </h1>

          <p className="mt-5 max-w-[460px] text-body-large text-muted-foreground md:mt-6">
            {t('errorPage.description')}
          </p>

          <p className="mt-4 max-w-[460px] text-body-large text-muted-foreground">
            {t('errorPage.hint')}
          </p>

          <button
            type="button"
            onClick={reset}
            className={cn(
              navButtonLinkVariants({
                variant: VARIANTS.PRIMARY,
                size: SIZES.MD,
              }),
              'mt-8 min-w-32 md:mt-10',
            )}
          >
            {t('errorPage.tryAgain')}
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md text-body font-medium text-outline-foreground underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            {t('errorPage.goBack')}
          </button>
        </div>
      </div>
    </PageSection>
  )
}
