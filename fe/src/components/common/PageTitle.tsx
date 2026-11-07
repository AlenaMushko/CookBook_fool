import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const PageTitle = ({
  children,
  className,
  hidden = false,
}: {
  children: ReactNode
  className?: string
  hidden?: boolean
}) => <h1 className={cn(hidden && 'sr-only', className)}>{children}</h1>
