import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden",
    "rounded-[20px] border-[3px] px-4 py-[7px]",
    "font-sans text-btn text-center leading-[19.5px] whitespace-nowrap",
    "transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/35",
    "has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
    "[&>svg]:pointer-events-none [&>svg]:size-3.5",
  ],
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary font-semibold text-primary-foreground",
        secondary:
          "border-border bg-input-bg font-normal text-muted-foreground",
        muted:
          "border-transparent bg-disabled-bg font-normal text-disabled-foreground",
        outline:
          "border-border bg-input-bg font-normal text-muted-foreground",
        destructive:
          "border-error-border bg-error-bg font-normal text-error",
        ghost: "border-transparent bg-transparent font-normal text-muted-foreground",
        link: "border-transparent bg-transparent font-normal text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
