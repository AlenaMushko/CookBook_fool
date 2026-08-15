import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3 md:gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio-group-item relative flex aspect-square shrink-0 items-center justify-center",
        "size-5 rounded-full border-2 border-border bg-input-bg md:size-[18px]",
        "text-primary-foreground transition-colors outline-none",
        "after:absolute after:-inset-2.5 md:after:-inset-2",
        "hover:border-input-hover",
        "focus-visible:border-input-focus",
        "data-checked:border-primary data-checked:bg-primary",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-bg disabled:opacity-50",
        "aria-invalid:border-error aria-invalid:bg-error-bg",
        "aria-invalid:data-checked:border-error aria-invalid:data-checked:bg-error",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex size-full items-center justify-center"
      >
        <span className="size-[7px] shrink-0 rounded-full bg-primary-foreground" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
