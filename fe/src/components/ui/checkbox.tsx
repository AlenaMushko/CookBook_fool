import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center md:size-[18px]",
        "rounded-[6px] border-2 border-border bg-input-bg",
        "text-primary-foreground transition-colors outline-none",
        "after:absolute after:-inset-2.5 md:after:-inset-2",
        "hover:border-input-hover",
        "focus-visible:border-input-focus",
        "data-checked:border-primary data-checked:bg-primary",
        "data-indeterminate:border-primary data-indeterminate:bg-primary",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-bg disabled:opacity-50",
        "group-has-disabled/field:opacity-50",
        "aria-invalid:border-error aria-invalid:bg-error-bg",
        "aria-invalid:data-checked:border-error aria-invalid:data-checked:bg-error",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <Check strokeWidth={1.375} className="size-[11px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
