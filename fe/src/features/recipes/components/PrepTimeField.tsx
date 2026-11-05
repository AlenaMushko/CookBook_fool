import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Field, FieldError, FieldLabel } from '@components/ui/field'
import { Input } from '@components/ui/input'

const formLabelClass = 'text-label uppercase tracking-[0.12em]'

const formatPrepTime = (
  minutes: number,
  t: (key: string, options?: Record<string, number>) => string,
) => {
  if (minutes < 60) {
    return t('recipe.create.minutesShort', { count: minutes })
  }

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (rest === 0) {
    return t('recipe.create.hoursShort', { count: hours })
  }

  return t('recipe.create.hoursMinutes', { hours, minutes: rest })
}

export const PrepTimeField = ({
  value,
  onChange,
  invalid,
  error,
}: {
  value: string
  onChange: (value: string) => void
  invalid: boolean
  error?: string
}) => {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(value)
  const minutes = /^[1-9]\d*$/.test(value) ? Number(value) : 0
  const shown =
    focused || !/^[1-9]\d*$/.test(value)
      ? focused
        ? draft
        : value
      : formatPrepTime(minutes, t)

  const applyMinutes = (next: number) => {
    const stored = next > 0 ? String(next) : ''
    onChange(stored)
    setDraft(stored)
  }

  const step = (delta: number) => {
    const raw = (focused ? draft : value).trim()
    const current = /^[1-9]\d*$/.test(raw) ? Number(raw) : 0
    applyMinutes(Math.max(0, current + delta))
  }

  return (
    <Field data-invalid={invalid}>
      <FieldLabel className={formLabelClass}>{t('recipe.create.cookTime')}</FieldLabel>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={t('recipe.create.cookTimeDecrease')}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => step(-5)}
        >
          <Minus strokeWidth={1.5} />
        </Button>
        <Input
          value={shown}
          inputMode="numeric"
          placeholder={t('recipe.create.cookTimePlaceholder')}
          aria-invalid={invalid}
          onFocus={() => {
            setDraft(minutes > 0 ? String(minutes) : '')
            setFocused(true)
          }}
          onBlur={() => {
            setFocused(false)
            onChange(draft.trim())
          }}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            onChange(next)
          }}
          className="text-center"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={t('recipe.create.cookTimeIncrease')}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => step(5)}
        >
          <Plus strokeWidth={1.5} />
        </Button>
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
