import type { ReactNode } from 'react'

import { PageSection } from '@components/layout'

import './auth-page.css'

type AuthSplitLayoutProps = {
  illustration: string
  children: ReactNode
}

export const AuthSplitLayout = ({
  illustration,
  children,
}: AuthSplitLayoutProps) => {
  return (
    <PageSection centered className="bg-background py-10 md:py-12 lg:py-16">
      <div className="grid w-full items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:gap-10 lg:gap-16">
        <div
          aria-hidden="true"
          className="auth-page__illustration mx-auto md:mx-0"
        >
          <img
            src={illustration}
            alt=""
            className="h-auto w-full object-contain"
            draggable={false}
          />
        </div>

        <div className="mx-auto w-full max-w-[420px] md:max-w-none">
          <div className="rounded-2xl border border-border bg-card px-6 py-8 shadow-card md:px-8 md:py-10">
            {children}
          </div>
        </div>
      </div>
    </PageSection>
  )
}
