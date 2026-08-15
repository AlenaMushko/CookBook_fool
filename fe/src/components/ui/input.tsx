import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 md:h-[41.5px]",
        "rounded-[7px] border-2 border-border bg-input-bg",
        "px-3 py-2 md:py-[9px]",
        "font-sans text-btn font-normal text-foreground",
        "transition-colors outline-none",
        "placeholder:text-foreground/50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-btn file:font-semibold file:text-foreground",
        "hover:border-input-hover",
        "focus-visible:border-input-focus",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:border-border disabled:bg-disabled-bg disabled:text-disabled-foreground",
        "aria-invalid:border-error aria-invalid:bg-error-bg",
        "data-[state=success]:border-success data-[state=success]:bg-success-bg",
        className
      )}
      {...props}
    />
  )
}

export { Input }
