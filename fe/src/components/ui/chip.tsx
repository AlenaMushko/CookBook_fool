import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center self-stretch",
    "rounded-[20px] px-4 py-[7px]",
    "font-sans text-btn text-center leading-[19.5px] whitespace-nowrap",
    "border-[3px] transition-colors outline-none select-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/35",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-border bg-input-bg font-normal text-muted-foreground",
          "hover:border-input-hover hover:text-foreground",
        ],
        active: [
          "border-primary bg-primary font-semibold text-primary-foreground",
          "hover:bg-primary-hover hover:border-primary-hover",
        ],
        disabled: [
          "border-transparent bg-disabled-bg font-normal text-disabled-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Chip({
  className,
  variant,
  active = false,
  disabled = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof chipVariants> & {
    active?: boolean
  }) {
  const resolvedVariant = disabled
    ? "disabled"
    : (variant ?? (active ? "active" : "default"))

  return (
    <button
      type={type}
      data-slot="chip"
      data-variant={resolvedVariant}
      data-active={active || resolvedVariant === "active" || undefined}
      disabled={disabled}
      aria-pressed={
        resolvedVariant === "active" || active ? true : false
      }
      className={cn(chipVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  )
}

function ChipGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chip-group"
      role="group"
      className={cn(
        "flex w-full max-w-full flex-wrap items-center gap-2",
        "md:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

export { Chip, ChipGroup, chipVariants }
