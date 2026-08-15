import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

function SearchInput({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"input"> & {
  containerClassName?: string
}) {
  return (
    <div
      data-slot="search-input"
      className={cn(
        "flex w-full items-center gap-2 md:w-[210px] md:max-w-full",
        "rounded-[8px] border border-border bg-background",
        "px-3 py-2.5 md:py-2",
        "transition-colors",
        "has-[:focus-visible]:border-input-focus",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
        containerClassName
      )}
    >
      <Search
        strokeWidth={1.5}
        aria-hidden="true"
        className="size-3.5 shrink-0 text-foreground/50"
      />
      <InputPrimitive
        type="search"
        data-slot="search-input-control"
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent p-0",
          "font-sans text-btn font-normal text-foreground",
          "outline-none placeholder:text-foreground/50",
          "disabled:cursor-not-allowed",
          "[&::-webkit-search-cancel-button]:appearance-none",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
