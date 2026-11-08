import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { Field, FieldError, FieldLabel } from '@components/ui/field'
import { Input } from '@components/ui/input'

import { sanitizeQuantityInput } from '../lib/ingredient-quantity'

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

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={inputId} className="sr-only">
        {t('recipe.create.qty')}
      </FieldLabel>
      <Input
        id={inputId}
        inputMode="decimal"
        autoComplete="off"
        aria-invalid={Boolean(error)}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(sanitizeQuantityInput(event.target.value))}
        onBlur={onBlur}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
