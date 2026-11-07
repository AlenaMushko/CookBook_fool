import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DishListOrder, type DishListScope, type DishListSort } from '@constants/recipe'
import {
  COOKBOOK_SCOPES,
  COOKBOOK_SORT_CHIPS,
  cookbookScopeKey,
} from '@/features/cookbook/constants'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import type { DishCategory } from '@/features/recipes/types/recipe.types'
import { cn } from '@/lib/utils'

export type DishFilterSurface = 'page' | 'panel'

const idleSurfaceClass = {
  page: 'border border-border bg-card',
  panel: 'border border-border bg-background',
} as const

const chipClass = (selected: boolean, surface: DishFilterSurface) =>
  cn(
    'cursor-pointer rounded-full text-[13px] leading-5 whitespace-nowrap transition-colors',
    selected
      ? 'bg-primary font-semibold text-primary-foreground'
      : cn(
          idleSurfaceClass[surface],
          'font-normal text-muted-foreground hover:bg-secondary',
        ),
  )

export const DishScopeTabs = ({
  value,
  onChange,
  ariaLabel,
  className,
  tabClassName,
}: {
  value: DishListScope
  onChange: (scope: DishListScope) => void
  ariaLabel?: string
  className?: string
  tabClassName?: string
}) => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex flex-wrap', className)} role="tablist" aria-label={ariaLabel}>
      {COOKBOOK_SCOPES.map((scope) => {
        const selected = value === scope
        return (
          <button
            key={scope}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(scope)}
            className={cn(
              'cursor-pointer border-b-[1.5px] px-5 py-2 text-[13px] leading-5 whitespace-nowrap transition-colors',
              tabClassName,
              selected
                ? 'border-primary font-semibold text-primary'
                : 'border-transparent font-normal text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`cookbook.${cookbookScopeKey[scope]}`)}
          </button>
        )
      })}
    </div>
  )
}

export const DishCategoryChips = ({
  categories,
  value,
  onChange,
  surface = 'page',
  className,
}: {
  categories: DishCategory[]
  value?: string
  onChange: (categoryId: string | undefined) => void
  surface?: DishFilterSurface
  className?: string
}) => {
  const { t, i18n } = useTranslation()

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={cn(chipClass(value == null, surface), 'px-4 py-[7px]')}
      >
        {t('cookbook.all')}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={cn(chipClass(value === category.id, surface), 'px-4 py-[7px]')}
        >
          {localizedName(i18n.language, category)}
        </button>
      ))}
    </div>
  )
}

export const DishSortChips = ({
  sort,
  order,
  onChange,
  surface = 'page',
  className,
}: {
  sort: DishListSort
  order: DishListOrder
  onChange: (next: { sort: DishListSort; order: DishListOrder }) => void
  surface?: DishFilterSurface
  className?: string
}) => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {COOKBOOK_SORT_CHIPS.map(({ key, icon: Icon }) => {
        const selected = sort === key
        const Arrow = order === DishListOrder.ASC ? ChevronUp : ChevronDown
        return (
          <button
            key={key}
            type="button"
            aria-pressed={selected}
            onClick={() =>
              onChange(
                selected
                  ? {
                      sort: key,
                      order:
                        order === DishListOrder.ASC
                          ? DishListOrder.DESC
                          : DishListOrder.ASC,
                    }
                  : { sort: key, order: DishListOrder.ASC },
              )
            }
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-5 whitespace-nowrap transition-colors',
              selected
                ? 'bg-primary/15 font-medium text-primary'
                : cn(
                    idleSurfaceClass[surface],
                    'font-normal text-muted-foreground hover:bg-secondary',
                  ),
            )}
          >
            <Icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            {t(`cookbook.filters.${key}`)}
            {selected ? (
              <Arrow className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
