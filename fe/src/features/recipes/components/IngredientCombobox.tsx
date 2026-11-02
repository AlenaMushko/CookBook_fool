import { useQuery } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@components/ui/combobox'
import { cn } from '@/lib/utils'

import { recipesApi } from '../api/recipes.api'
import { recipeQueryKeys } from '../api/recipes.queries'
import { localizedName } from '../lib/recipe-locale'
import type { CatalogIngredient } from '../types/recipe.types'

type IngredientComboboxProps = {
  value: CatalogIngredient | null
  onChange: (value: CatalogIngredient | null) => void
  invalid?: boolean
  className?: string
}

function useDebounced(value: string, delay = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}

export function IngredientCombobox({
  value,
  onChange,
  invalid = false,
  className,
}: IngredientComboboxProps) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const search = useDebounced(query.trim())

  const { data, isFetching } = useQuery({
    queryKey: recipeQueryKeys.ingredients(search),
    queryFn: () => recipesApi.searchIngredients(search),
    enabled: search.length > 0,
  })

  const items = useMemo(() => {
    const list = data?.data ?? []
    if (value && !list.some((item) => item.id === value.id)) {
      return [value, ...list]
    }
    return list
  }, [data, value])

  const label = (item: CatalogIngredient) => localizedName(i18n.language, item)
  const showSelectedImage = Boolean(value?.image) && query.length === 0

  useLayoutEffect(() => {
    if (!value) return
    const next = localizedName(i18n.language, value)
    setQuery((current) =>
      current === value.nameEn || current === value.nameUk ? next : current,
    )
  }, [i18n.language, value])

  return (
    <Combobox
      items={items}
      value={value}
      inputValue={query}
      onValueChange={(next) => onChange(next)}
      onInputValueChange={setQuery}
      filter={null}
      itemToStringLabel={label}
      isItemEqualToValue={(item, selected) => item.id === selected.id}
    >
      <div className="relative">
        {showSelectedImage ? (
          <img
            src={value?.image ?? undefined}
            alt=""
            className="pointer-events-none absolute top-1/2 left-2 z-10 size-6 -translate-y-1/2 rounded object-cover"
          />
        ) : null}
        <ComboboxInput
          aria-invalid={invalid}
          placeholder={t('recipe.create.ingredientPlaceholder')}
          className={cn(
            className,
            'w-full',
            showSelectedImage && '[&_[data-slot=input-group-control]]:pl-9',
          )}
        />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>
          {isFetching ? '…' : t('recipe.create.ingredientEmpty')}
        </ComboboxEmpty>
        <ComboboxList>
          {(item: CatalogIngredient) => (
            <ComboboxItem key={item.id} value={item}>
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="size-6 shrink-0 rounded object-cover"
                />
              ) : (
                <span className="size-6 shrink-0 rounded bg-muted" />
              )}
              {label(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
