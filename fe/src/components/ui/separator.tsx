import * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const separatorVariants = cva("shrink-0", {
  variants: {
    variant: {
      border: "bg-border",
      divider: "bg-divider",
    },
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px self-stretch",
    },
  },
  defaultVariants: {
    variant: "divider",
    orientation: "horizontal",
  },
})

function Separator({
  className,
  orientation = "horizontal",
  variant = "divider",
  ...props
}: SeparatorPrimitive.Props & VariantProps<typeof separatorVariants>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-variant={variant ?? "divider"}
      orientation={orientation}
      className={cn(
        separatorVariants({ variant, orientation }),
        className
      )}
      {...props}
    />
  )
}

function SeparatorWithText({
  className,
  children = "or",
  variant = "divider",
  ...props
}: React.ComponentProps<"div"> &
  Pick<VariantProps<typeof separatorVariants>, "variant">) {
  return (
    <div
      data-slot="separator-with-text"
      role="separator"
      className={cn(
        "flex w-full items-center gap-3 py-1.5",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "h-px min-w-0 flex-1",
          variant === "border" ? "bg-border" : "bg-divider"
        )}
      />
      <span className="shrink-0 font-sans text-btn font-normal text-subtle">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "h-px min-w-0 flex-1",
          variant === "border" ? "bg-border" : "bg-divider"
        )}
      />
    </div>
  )
}

export { Separator, SeparatorWithText, separatorVariants }
