import { useQuery } from '@tanstack/react-query'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
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
  onBlur?: () => void
  invalid?: boolean
  className?: string
}

const useDebounced = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}

export const IngredientCombobox = ({
  value,
  onChange,
  onBlur,
  invalid = false,
  className,
}: IngredientComboboxProps) => {
  const { t, i18n } = useTranslation()
  const inputId = useId()
  const selectedLabel = value ? localizedName(i18n.language, value) : ''
  const [inputValue, setInputValue] = useState(selectedLabel)
  const inputValueRef = useRef(inputValue)
  const valueRef = useRef(value)
  valueRef.current = value

  const commitInput = (next: string) => {
    inputValueRef.current = next
    setInputValue(next)
  }

  useEffect(() => {
    commitInput(selectedLabel)
  }, [value?.id, selectedLabel])

  const searching = inputValue !== selectedLabel
  const search = useDebounced(searching ? inputValue.trim() : '')

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
  const showSelectedImage = Boolean(value?.image) && inputValue === selectedLabel

  return (
    <Combobox
      items={items}
      value={value}
      inputValue={inputValue}
      onValueChange={(next) => {
        if (next == null && inputValueRef.current.trim() !== '') return
        valueRef.current = next
        onChange(next)
      }}
      onInputValueChange={commitInput}
      onOpenChange={(open) => {
        if (open) return
        const selected = valueRef.current
        if (inputValueRef.current.trim() === '') {
          onChange(null)
          commitInput('')
        } else {
          commitInput(selected ? localizedName(i18n.language, selected) : '')
        }
        onBlur?.()
      }}
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
        <label htmlFor={inputId} className="sr-only">
          {t('recipe.create.ingredient')}
        </label>
        <ComboboxInput
          id={inputId}
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
