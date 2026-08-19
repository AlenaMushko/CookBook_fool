import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const metaBadgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5",
    "rounded-[20px] border-[1.5px] px-3 py-1.5",
    "font-sans text-[12px] leading-[18px] font-normal whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[13px]",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-muted-foreground",
        success: "border-success-border bg-success-bg text-success",
        warning: "border-warning-border bg-warning-bg text-warning",
        error: "border-error-border bg-error-bg text-error",
        brand: "border-border bg-brand-soft text-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type MetaBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof metaBadgeVariants> & {
    icon?: React.ReactNode
    children: React.ReactNode
  }

function MetaBadge({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: MetaBadgeProps) {
  return (
    <span
      data-slot="meta-badge"
      data-variant={variant ?? "default"}
      className={cn(metaBadgeVariants({ variant }), className)}
      {...props}
    >
      {icon ? (
        <span data-slot="meta-badge-icon" className="inline-flex text-current">
          {icon}
        </span>
      ) : null}
      <span data-slot="meta-badge-label">{children}</span>
    </span>
  )
}

function MetaBadgeGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="meta-badge-group"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export { MetaBadge, MetaBadgeGroup, metaBadgeVariants }
