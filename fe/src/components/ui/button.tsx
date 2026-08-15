import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "type-btn gap-1.5 whitespace-nowrap rounded-lg",
    "transition-[color,background-color,box-shadow] duration-150",
    "outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35",
    "active:shadow-primary-active",
    "disabled:pointer-events-none",
    "disabled:border-transparent",
    "disabled:bg-disabled-bg",
    "disabled:text-disabled-foreground",
    "disabled:opacity-100",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-[3px]",
    "aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-3",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border border-transparent",
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover",
          "active:bg-primary-active",
        ],
        secondary: [
          "border-[1.5px] border-secondary-border",
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary-hover",
          "active:bg-secondary-active",
        ],
        outline: [
          "border border-transparent",
          "bg-outline text-outline-foreground",
          "hover:bg-outline-hover",
          "active:bg-outline-active",
        ],
        // alias for shadcn internals (close, clear, pagination)
        ghost: [
          "border border-transparent",
          "bg-outline text-outline-foreground",
          "hover:bg-outline-hover",
          "active:bg-outline-active",
        ],
        destructive: [
          "border border-transparent",
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive-hover",
          "active:bg-destructive-active",
          "focus-visible:ring-destructive/30",
        ],
      },
      size: {
        default:
          "min-h-11 px-4 py-2.5 md:min-h-0 md:px-5 md:py-[9px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 md:has-data-[icon=inline-end]:pr-4 md:has-data-[icon=inline-start]:pl-4",
        modal:
          "min-h-10 px-3 py-2 md:min-h-0 md:px-4 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 md:has-data-[icon=inline-end]:pr-3 md:has-data-[icon=inline-start]:pl-3",
        xs: "gap-1 px-2.5 py-1 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 gap-1 px-3 py-1.5 md:min-h-0 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "min-h-12 gap-2 px-5 py-3 md:min-h-0 md:px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 md:has-data-[icon=inline-end]:pr-5 md:has-data-[icon=inline-start]:pl-5",
        icon: "size-11 p-0 md:size-10",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 p-0 md:size-8",
        "icon-lg": "size-12 p-0 md:size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  isLoading = false,
  loadingText,
  text,
  children,
  disabled,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    text?: string
    isLoading?: boolean
    loadingText?: string
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText ?? children}
        </>
      ) : (
       text ?? children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
