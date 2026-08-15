import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type RecipeCardSkeletonProps = {
  className?: string
}

function RecipeCardSkeleton({ className }: RecipeCardSkeletonProps) {
  return (
    <div
      data-slot="recipe-card-skeleton"
      aria-hidden
      className={cn(
        "flex w-full max-w-[209px] flex-col overflow-hidden",
        "rounded-[10px] border-[1.5px] border-border bg-input-bg",
        className
      )}
    >
      <div
        className={cn(
          "relative h-[120px] w-full shrink-0 self-stretch",
          "bg-secondary",
          "bg-gradient-to-b from-[#fffdf8] to-secondary"
        )}
      />

      <div className="flex w-full flex-col items-start self-stretch px-[13px] pt-[11px] pb-[13px]">
        <Skeleton className="h-3.5 w-[62%] rounded-full" />
        <Skeleton className="mt-[3px] h-[11px] w-[78%] rounded-full" />
        <div className="mt-[7px] flex items-center gap-1.5">
          <Skeleton className="h-[11px] w-8 rounded-full" />
          <Skeleton className="h-[11px] w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

type RecipeCardSkeletonGridProps = {
  count?: number
  className?: string
}

function RecipeCardSkeletonGrid({
  count = 3,
  className,
}: RecipeCardSkeletonGridProps) {
  return (
    <div
      data-slot="recipe-card-skeleton-grid"
      role="status"
      aria-label="Loading recipes"
      aria-busy="true"
      className={cn(
        "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <RecipeCardSkeleton key={i} className="max-w-none" />
      ))}
    </div>
  )
}

export { RecipeCardSkeleton, RecipeCardSkeletonGrid }
