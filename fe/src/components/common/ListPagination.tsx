import { useTranslation } from 'react-i18next'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination'
import { pageItems } from '@/lib/pagination'
import { cn } from '@/lib/utils'

export const ListPagination = ({
  page,
  pageCount,
  onPageChange,
  className,
  label,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
  label?: string
}) => {
  const { t } = useTranslation()

  if (pageCount <= 1) return null

  const goTo = (next: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (next < 1 || next > pageCount || next === page) return
    onPageChange(next)
  }

  return (
    <Pagination className={cn('mt-8', className)} aria-label={label ?? t('pagination.label')}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label={t('pagination.page', { page: Math.max(1, page - 1) })}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-40' : undefined}
            onClick={goTo(page - 1)}
          />
        </PaginationItem>
        {pageItems(page, pageCount).map((item, index) => (
          <PaginationItem key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={item === page}
                aria-label={t('pagination.page', { page: item })}
                onClick={goTo(item)}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label={t('pagination.page', { page: Math.min(pageCount, page + 1) })}
            aria-disabled={page >= pageCount}
            className={page >= pageCount ? 'pointer-events-none opacity-40' : undefined}
            onClick={goTo(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
