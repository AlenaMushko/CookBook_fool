import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageSectionProps = {
  children: ReactNode
  className?: string
  centered?: boolean
}

export const PageSection = ({
  children,
  className,
  centered = false,
}: PageSectionProps) => {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-page px-page-x',
        'py-12 md:py-16 lg:py-20',
        centered && 'flex flex-1 flex-col justify-center',
        className,
      )}
    >
      {children}
    </section>
  )
}
