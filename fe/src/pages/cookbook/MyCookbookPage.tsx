import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ListPagination } from '@components/common/ListPagination'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/ui/search-input'
import { Routes } from '@constants/routes'
import { CookbookCard } from '@/features/cookbook/components/CookbookCard'
import { COOKBOOK_PAGE_SIZE } from '@/features/cookbook/constants'
import {
  cookbookStateFromSearch,
  toCookbookSearch,
  type CookbookListState,
} from '@/features/cookbook/list-search'
import {
  DishCategoryChips,
  DishScopeTabs,
  DishSortChips,
} from '@/features/recipes/components/dish-filters'
import { RecipeCardSkeleton } from '@/features/recipes/components/RecipeCardSkeleton'
import { useDishCategories } from '@/features/recipes/hooks/useDishCategories'
import { useDishList } from '@/features/recipes/hooks/useDishList'

const cardGridClass = [
  'grid w-full justify-center gap-3 sm:gap-4',
  '[grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),200px))]',
  '@min-[640px]:[grid-template-columns:repeat(auto-fit,minmax(280px,320px))]',
  '@min-[1040px]:[grid-template-columns:repeat(auto-fit,minmax(320px,360px))]',
].join(' ')

export const MyCookbookPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const list = cookbookStateFromSearch(
    useSearch({ from: '/_authenticated/my-cookbook' }),
  )
  const { q: search, scope, category: categoryId, sort, order, page } = list
  const commit = useCallback(
    (patch: Partial<CookbookListState>) => {
      void navigate({
        to: Routes.MY_COOKBOOK,
        search: (current) =>
          toCookbookSearch({ ...cookbookStateFromSearch(current), ...patch }),
        replace: true,
      })
    },
    [navigate],
  )

  const categories = useDishCategories()
  const { query: listQuery, total, pageCount } = useDishList({
    scopeKey: ['dishes', 'list'],
    scope,
    categoryId,
    sort,
    order,
    page,
    pageSize: COOKBOOK_PAGE_SIZE,
  })

  useEffect(() => {
    if (listQuery.data && page > pageCount) commit({ page: pageCount })
  }, [commit, listQuery.data, page, pageCount])

  return (
    <div className="-m-5 flex min-h-full flex-col">
      <header className="border-b border-border bg-card px-5 pt-[18px] sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-serif text-[26px] leading-[39px] font-normal text-foreground">
              {t('cookbook.title')}
            </h1>
            <p className="text-[13px] leading-5 text-muted-foreground">
              {t('cookbook.subtitle')}
            </p>
          </div>
          <div className="flex w-full items-center gap-2.5 lg:w-auto lg:shrink-0">
            <SearchInput
              value={search}
              onChange={(event) => commit({ q: event.target.value })}
              placeholder={t('cookbook.searchPlaceholder')}
              aria-label={t('cookbook.searchPlaceholder')}
              containerClassName="w-full max-w-none flex-1 bg-background md:w-auto lg:w-[210px] lg:flex-none"
            />
            <Button
              render={<Link to={Routes.RECIPE_NEW} />}
              className="hidden h-[38px] min-h-0 shrink-0 px-[18px] py-[9px] text-[13px] md:inline-flex"
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
              {t('cookbook.create')}
            </Button>
          </div>
        </div>
        <DishScopeTabs
          className="mt-3.5"
          value={scope}
          ariaLabel={t('cookbook.title')}
          onChange={(next) => commit({ scope: next, page: 1 })}
        />
      </header>

      <div className="border-b border-border bg-background px-5 pt-3 sm:px-7">
        <DishCategoryChips
          className="pb-3"
          categories={categories}
          value={categoryId}
          onChange={(category) => commit({ category, page: 1 })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-divider bg-background px-5 py-2.5 sm:px-7">
        {listQuery.data ? (
          <p className="text-[13px] leading-5 text-subtle">
            {t('cookbook.count', { count: total })}
          </p>
        ) : (
          <span className="text-[13px] leading-5 text-transparent" aria-hidden>
            0
          </span>
        )}
        <DishSortChips
          className="min-w-0 flex-1 justify-center"
          sort={sort}
          order={order}
          onChange={(next) => commit({ ...next, page: 1 })}
        />
      </div>

      <div className="@container flex w-full flex-1 flex-col px-5 pt-6 pb-12 sm:px-7">
        {listQuery.isPending ? (
          <div className={cardGridClass}>
            {Array.from({ length: 8 }, (_, index) => (
              <RecipeCardSkeleton key={index} className="w-full max-w-none" />
            ))}
          </div>
        ) : null}

        {listQuery.isError ? (
          <p className="text-[13px] text-muted-foreground">{t('cookbook.error')}</p>
        ) : null}

        {listQuery.data && listQuery.data.data.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">{t('cookbook.empty')}</p>
        ) : null}

        {listQuery.data && listQuery.data.data.length > 0 ? (
          <div className={cardGridClass}>
            {listQuery.data.data.map((dish) => (
              <CookbookCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : null}

        <ListPagination
          page={page}
          pageCount={pageCount}
          onPageChange={(next) => commit({ page: next })}
          label={t('cookbook.pages')}
        />
      </div>
    </div>
  )
}
