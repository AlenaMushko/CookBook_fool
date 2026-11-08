import { ChevronDown, ChevronUp } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { Field, FieldError, FieldLabel } from '@components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@components/ui/input-group'

const parseQuantity = (value: string) => {
  const parsed = Number(value.trim().replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

const formatQuantity = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000
  return String(rounded)
}

export const QuantityField = ({
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  disabled?: boolean
  error?: string
}) => {
  const { t } = useTranslation()
  const inputId = useId()
  const current = parseQuantity(value)
  const canDecrease = current != null && current > 1

  const step = (delta: number) => {
    if (current == null || current < 1) {
      onChange('1')
      return
    }
    onChange(formatQuantity(Math.max(1, current + delta)))
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={inputId} className="sr-only">
        {t('recipe.create.qty')}
      </FieldLabel>
      <InputGroup className="md:h-[41.5px]">
        <InputGroupInput
          id={inputId}
          inputMode="decimal"
          placeholder={t('recipe.create.qtyPlaceholder')}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            if (current == null || current < 1) onChange('1')
            onBlur()
          }}
        />
        <InputGroupAddon
          align="inline-end"
          className="flex-col gap-0 py-0.5 pr-1.5"
        >
          <button
            type="button"
            aria-label={t('recipe.create.quantityIncrease')}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => step(1)}
            className="cursor-pointer rounded-sm p-0.5 text-foreground/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronUp strokeWidth={1.5} className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={t('recipe.create.quantityDecrease')}
            disabled={disabled || !canDecrease}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => step(-1)}
            className="cursor-pointer rounded-sm p-0.5 text-foreground/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronDown strokeWidth={1.5} className="size-3.5" />
          </button>
        </InputGroupAddon>
      </InputGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
