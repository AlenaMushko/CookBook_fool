import * as React from 'react'

import { cn } from '@/lib/utils'

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

export type FormFieldInputProps = {
  label: React.ReactNode
  error?: string
  id?: string
  labelClassName?: string
  className?: string
  footer?: React.ReactNode
  required?: boolean
  endIcon?: React.ReactNode
  endIconAriaLabel?: string
  endIconPressed?: boolean
  onEndIconClick?: React.MouseEventHandler<HTMLButtonElement>
} & React.ComponentProps<typeof Input>

export function FormFieldInput({
  label,
  error,
  id: idProp,
  labelClassName,
  className,
  footer,
  required,
  name,
  disabled,
  endIcon,
  endIconAriaLabel,
  endIconPressed,
  onEndIconClick,
  ...inputProps
}: FormFieldInputProps) {
  const inputId = idProp ?? (typeof name === 'string' ? name : undefined)
  const hasError = Boolean(error)
  const hasEndIcon = endIcon != null

  const controlProps = {
    id: inputId,
    name,
    'aria-invalid': hasError,
    'aria-required': required,
    disabled,
    ...inputProps,
  }

  return (
    <Field data-invalid={hasError} className={className}>
      <FieldLabel
        htmlFor={inputId}
        className={cn('text-label uppercase tracking-[0.12em]', labelClassName)}
      >
        {label}
        {required ? (
          <span className="text-error" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </FieldLabel>

      <FieldContent>
        {hasEndIcon ? (
          <InputGroup>
            <InputGroupInput {...controlProps} />

            <InputGroupAddon align="inline-end">
              {onEndIconClick ? (
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={endIconAriaLabel}
                  aria-pressed={endIconPressed}
                  disabled={disabled}
                  onClick={onEndIconClick}
                >
                  {endIcon}
                </InputGroupButton>
              ) : (
                <span
                  className="flex size-6 items-center justify-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
                  aria-hidden={endIconAriaLabel ? undefined : true}
                  aria-label={endIconAriaLabel}
                >
                  {endIcon}
                </span>
              )}
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <Input {...controlProps} />
        )}
      </FieldContent>

      {error ? <FieldError>{error}</FieldError> : null}
      {footer}
    </Field>
  )
}
