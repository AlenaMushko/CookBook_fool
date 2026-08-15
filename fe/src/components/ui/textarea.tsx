import * as React from "react"

import { cn } from "@/lib/utils"

const textareaClassName = cn(
  "flex min-h-[120px] w-full resize-none md:min-h-[86px]",
  "rounded-[7px] border-2 border-border bg-input-bg",
  "px-3 py-2.5 md:py-[9px]",
  "font-sans text-btn font-normal text-foreground",
  "transition-colors outline-none",
  "placeholder:text-foreground/50",
  "hover:border-input-hover",
  "focus-visible:border-input-focus",
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-bg disabled:text-disabled-foreground",
  "aria-invalid:border-error aria-invalid:bg-error-bg",
  "data-[state=success]:border-success data-[state=success]:bg-success-bg"
)

function Textarea({
  className,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<"textarea">) {
  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = React.useState(
    () => String(defaultValue ?? "").length
  )

  const length = isControlled
    ? String(value ?? "").length
    : uncontrolledLength

  const showCounter = maxLength != null

  const textarea = (
    <textarea
      data-slot="textarea"
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => {
        if (!isControlled) {
          setUncontrolledLength(event.target.value.length)
        }
        onChange?.(event)
      }}
      className={cn(textareaClassName, className)}
      {...props}
    />
  )

  if (!showCounter) {
    return textarea
  }

  return (
    <div data-slot="textarea-wrapper" className="flex w-full flex-col">
      {textarea}
      <p
        data-slot="textarea-counter"
        className="mt-2.5 text-right font-sans text-counter font-normal text-subtle"
        aria-live="polite"
      >
        {length} / {maxLength}
      </p>
    </div>
  )
}

export { Textarea }
