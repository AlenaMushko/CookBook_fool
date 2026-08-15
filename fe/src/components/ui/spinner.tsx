import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type SpinnerSize = "sm" | "default" | "lg" | "xl"

const sizeClass: Record<SpinnerSize, string> = {
  sm: "size-3",
  default: "size-4",
  lg: "size-6 md:size-5",
  xl: "size-8 md:size-7",
}

function Spinner({
  className,
  size = "default",
}: {
  className?: string
  size?: SpinnerSize
}) {
  return (
    <Loader2
      strokeWidth={1.5}
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "shrink-0 animate-spin text-current",
        sizeClass[size],
        className
      )}
    />
  )
}

export { Spinner }
