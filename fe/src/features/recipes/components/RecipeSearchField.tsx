import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { SearchInput } from '@components/ui/search-input'
import { cn } from '@/lib/utils'

import { RECIPE_SEARCH_MIN_LENGTH } from '../lib/recipe-search'

export const RecipeSearchField = ({
  value,
  onChange,
  placeholder,
  className,
  containerClassName,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  containerClassName?: string
}) => {
  const { t } = useTranslation()
  const hintId = useId()
  const length = value.trim().length
  const showHint = length > 0 && length < RECIPE_SEARCH_MIN_LENGTH

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <SearchInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby={showHint ? hintId : undefined}
        containerClassName={containerClassName}
      />
      {showHint ? (
        <p id={hintId} className="mt-1.5 text-[12px] leading-4 text-subtle">
          {t('search.minLength')}
        </p>
      ) : null}
    </div>
  )
}
