import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "h-auto w-full max-w-full gap-4 overflow-x-auto rounded-none border-b border-divider bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-fit md:gap-6 md:overflow-visible",
        line: "h-auto w-full max-w-full gap-4 overflow-x-auto rounded-none border-b border-divider bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-fit md:gap-6 md:overflow-visible",
        pill: "h-11 rounded-lg border-2 border-border bg-secondary p-[3px] md:h-[43.5px] group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-1.5",
        "rounded-none border border-transparent",
        "px-0 py-2.5 md:py-2",
        "font-sans text-btn font-normal whitespace-nowrap text-muted-foreground",
        "transition-[color,font-weight,box-shadow] duration-150",
        "hover:text-primary",
        "focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "data-active:bg-transparent data-active:font-semibold data-active:text-primary",
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity",
        "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5",
        "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:right-0 group-data-vertical/tabs:after:w-0.5",
        "group-data-[variant=default]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=pill]/tabs-list:min-h-0 flex-1 self-stretch rounded-[6px] border-0",
        "group-data-[variant=pill]/tabs-list:px-4 group-data-[variant=pill]/tabs-list:py-[7px]",
        "group-data-[variant=pill]/tabs-list:font-normal group-data-[variant=pill]/tabs-list:text-muted-foreground",
        "group-data-[variant=pill]/tabs-list:hover:text-foreground",
        "group-data-[variant=pill]/tabs-list:data-active:bg-primary",
        "group-data-[variant=pill]/tabs-list:data-active:font-semibold",
        "group-data-[variant=pill]/tabs-list:data-active:text-primary-foreground",
        "group-data-[variant=pill]/tabs-list:data-active:after:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-body outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
