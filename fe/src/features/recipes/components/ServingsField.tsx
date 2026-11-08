import { Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Field, FieldError, FieldLabel } from '@components/ui/field'
import { Input } from '@components/ui/input'
import { MAX_SERVINGS } from '@constants/recipe'

const formLabelClass = 'text-label uppercase tracking-[0.12em]'

export const ServingsField = ({
  value,
  onChange,
  invalid,
  error,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  invalid: boolean
  error?: string
  disabled?: boolean
}) => {
  const { t } = useTranslation()

  const current = /^[1-9]\d*$/.test(value.trim()) ? Number(value) : null

  const step = (delta: number) => {
    const base = current ?? 6
    onChange(String(Math.min(MAX_SERVINGS, Math.max(1, base + delta))))
  }

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="recipe-servings" className={formLabelClass}>
        {t('recipe.create.servings')}
      </FieldLabel>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={t('recipe.create.servingsDecrease')}
          disabled={disabled || current === 1}
          onClick={() => step(-1)}
        >
          <Minus strokeWidth={1.5} />
        </Button>
        <Input
          id="recipe-servings"
          value={value}
          inputMode="numeric"
          aria-invalid={invalid}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="text-center"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={t('recipe.create.servingsIncrease')}
          disabled={disabled || current === MAX_SERVINGS}
          onClick={() => step(1)}
        >
          <Plus strokeWidth={1.5} />
        </Button>
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}
