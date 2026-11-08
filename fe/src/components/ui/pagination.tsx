import * as React from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const { t } = useTranslation()

  return (
    <nav
      role="navigation"
      aria-label={t("pagination.label")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-wrap items-center justify-center gap-1 md:gap-1.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center md:size-8",
        "rounded-[6px] border-[1.5px] font-sans text-btn font-semibold",
        "transition-colors outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/35",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label={t("pagination.previous")}
      className={className}
      {...props}
    >
      <ChevronLeft strokeWidth={1.5} />
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label={t("pagination.next")}
      className={className}
      {...props}
    >
      <ChevronRight strokeWidth={1.5} />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { t } = useTranslation()

  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center md:size-8",
        "rounded-[6px] border-[1.5px] border-border bg-card text-foreground",
        "[&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      <MoreHorizontal strokeWidth={1.5} />
      <span className="sr-only">{t("pagination.more")}</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
