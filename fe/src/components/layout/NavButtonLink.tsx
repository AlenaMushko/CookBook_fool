import { Link, useMatchRoute } from '@tanstack/react-router'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const VARIANTS = {
  OUTLINE: 'outline',
  PRIMARY: 'primary',
} as const

export type Variant = (typeof VARIANTS)[keyof typeof VARIANTS]

export const SIZES = {
  SM: 'sm',
  MD: 'md',
} as const

export const navButtonLinkVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'font-sans text-btn font-medium leading-[1.5]',
    'rounded-md transition-colors duration-150',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        [VARIANTS.OUTLINE]: [
          'border-[0.75px] border-secondary-border bg-transparent text-muted-foreground ',
          'hover:border-primary hover:bg-primary hover:text-primary-foreground',
        ],
        [VARIANTS.PRIMARY]: [
          'border border-transparent bg-primary text-primary-foreground',
          'hover:bg-primary-hover',
          'active:bg-primary-active',
        ],
      },
      size: {
        [SIZES.SM]: 'px-[14px] py-[6px]',
        [SIZES.MD]: 'px-4 py-[7px]',
      },
    },
    defaultVariants: {
      variant: VARIANTS.OUTLINE,
      size: 'sm',
    },
  },
)

const activeClassNames = {
  outline: 'border-primary bg-primary text-primary-foreground',
  primary: 'bg-primary-active',
} as const

export type NavButtonLinkProps = {
  to: string
  text: string
  className?: string
} & VariantProps<typeof navButtonLinkVariants>

export type Size = (typeof SIZES)[keyof typeof SIZES]

export const NavButtonLink = ({
  to,
  text,
  variant = VARIANTS.OUTLINE,
  size,
  className,
}: NavButtonLinkProps) => {
  const matchRoute = useMatchRoute()
  const isActive = Boolean(matchRoute({ to, fuzzy: false }))
  const resolvedVariant = variant ?? VARIANTS.OUTLINE
  const resolvedSize = size ?? (resolvedVariant === VARIANTS.PRIMARY ? SIZES.MD : SIZES.SM)

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        navButtonLinkVariants({ variant: resolvedVariant, size: resolvedSize }),
        isActive && activeClassNames[resolvedVariant],
        className,
      )}
    >
      {text}
    </Link>
  )
}
