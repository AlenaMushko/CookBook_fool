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

import { localizedName } from '../lib/recipe-locale'
import type { DishArea } from '../types/recipe.types'
import { CountryMark } from './CountryMark'

const startsWith = (name: string, query: string) =>
  name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())

export const countriesByPrefix = (countries: DishArea[], query: string) => {
  const needle = query.trim()
  if (needle.length < 2) return countries
  return countries.filter(
    (country) =>
      startsWith(country.nameUk, needle) || startsWith(country.nameEn, needle),
  )
}

export const CountrySelect = ({
  id,
  countries,
  value,
  onChange,
  disabled = false,
}: {
  id?: string
  countries: DishArea[]
  value: string
  onChange: (id: string) => void
  disabled?: boolean
}) => {
  const { t, i18n } = useTranslation()
  const generatedId = useId()
  const inputId = id ?? generatedId
  const selected = countries.find((country) => country.id === value) ?? null
  const selectedLabel = selected ? localizedName(i18n.language, selected) : ''
  const [inputValue, setInputValue] = useState(selectedLabel)
  const inputValueRef = useRef(inputValue)
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  const commitInput = (next: string) => {
    inputValueRef.current = next
    setInputValue(next)
  }

  useEffect(() => {
    commitInput(selectedLabel)
  }, [selected?.id, selectedLabel])

  const searching = inputValue !== selectedLabel
  const query = searching ? inputValue.trim() : ''
  const visible = useMemo(
    () => countriesByPrefix(countries, query),
    [countries, query],
  )
  const label = (country: DishArea) => localizedName(i18n.language, country)
  const showFlag = Boolean(selected) && inputValue === selectedLabel

  return (
    <Combobox
      items={visible}
      value={selected}
      inputValue={inputValue}
      onValueChange={(next) => {
        if (next == null && inputValueRef.current.trim() !== '') return
        selectedRef.current = next
        onChange(next?.id ?? '')
      }}
      onInputValueChange={commitInput}
      onOpenChange={(open) => {
        if (open) return
        if (inputValueRef.current.trim() === '') {
          onChange('')
          commitInput('')
          return
        }
        const current = selectedRef.current
        commitInput(current ? localizedName(i18n.language, current) : '')
      }}
      filter={null}
      itemToStringLabel={label}
      isItemEqualToValue={(item, current) => item.id === current.id}
      disabled={disabled}
    >
      <div className="relative">
        {showFlag && selected ? (
          <img
            src={selected.flagSvg}
            alt=""
            className="pointer-events-none absolute top-1/2 left-3 z-10 h-3.5 w-5 -translate-y-1/2 rounded-[2px] object-cover"
          />
        ) : null}
        <ComboboxInput
          id={inputId}
          disabled={disabled}
          placeholder={t('recipe.create.countryPlaceholder')}
          className={cn(showFlag && '[&_[data-slot=input-group-control]]:pl-10')}
        />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>{t('recipe.create.countryEmpty')}</ComboboxEmpty>
        <ComboboxList>
          {(country: DishArea) => (
            <ComboboxItem key={country.id} value={country}>
              <CountryMark area={country} language={i18n.language} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
