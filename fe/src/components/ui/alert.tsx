import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    "relative flex w-full flex-col items-start self-stretch",
    "rounded-lg border-[3px] px-4 py-3",
    "font-sans text-btn font-normal leading-[20.15px]",
  ],
  {
    variants: {
      variant: {
        success: "border-success-border bg-success-bg text-success",
        error: "border-error-border bg-error-bg text-error",
        warning: "border-warning-border bg-warning-bg text-warning",
        info: "border-info-border bg-info-bg text-info",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      data-variant={variant ?? "success"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-sans text-btn font-semibold leading-[20.15px]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "font-sans text-btn font-normal leading-[20.15px] [&_p]:leading-[20.15px]",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
