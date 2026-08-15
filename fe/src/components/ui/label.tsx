import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-0.5 font-sans text-[12px] leading-[18px] font-semibold text-foreground select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-disabled-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:text-disabled-foreground",
        "[&_[data-required]]:text-error",
        className
      )}
      {...props}
    />
  )
}

export { Label }
