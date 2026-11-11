import { localizedName } from '@/features/recipes/lib/recipe-locale'
import { cn } from '@/lib/utils'
import type { DishArea } from '@/features/recipes/types/recipe.types'

export const CountryMark = ({
  area,
  language,
  variant = 'text',
  className,
  flagClassName,
}: {
  area: DishArea
  language: string
  variant?: 'text' | 'badge'
  className?: string
  flagClassName?: string
}) => {
  return (
    <span
      className={cn(
        'inline-flex min-w-0 items-center gap-1.5',
        variant === 'badge' &&
          'absolute bottom-2.5 left-2.5 z-10 max-w-[calc(100%-1.25rem)] rounded-full bg-card px-2.5 py-1 text-[13px] leading-4 font-medium text-foreground shadow-[0_1px_3px_rgba(43,38,32,0.14)]',
        className,
      )}
    >
      <img
        src={area.flagSvg}
        alt=""
        className={cn(
          'h-3.5 w-5 shrink-0 rounded-[2px] object-cover',
          variant === 'badge' && 'h-4 w-[22px] rounded-[3px]',
          flagClassName,
        )}
      />
      <span className="truncate">{localizedName(language, area)}</span>
    </span>
  )
}
