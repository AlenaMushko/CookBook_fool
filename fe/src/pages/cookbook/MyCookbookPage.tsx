import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ListPagination } from '@components/common/ListPagination'
import { Button } from '@components/ui/button'
import { SearchInput } from '@components/ui/search-input'
import { DishListOrder } from '@constants/recipe'
import { Routes } from '@constants/routes'
import { CookbookCard } from '@/features/cookbook/components/CookbookCard'
import {
  COOKBOOK_PAGE_SIZE,
  COOKBOOK_SCOPES,
  COOKBOOK_SORT_CHIPS,
  cookbookScopeKey,
} from '@/features/cookbook/constants'
import {
  cookbookStateFromSearch,
  toCookbookSearch,
  type CookbookListState,
} from '@/features/cookbook/list-search'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { RecipeCardSkeleton } from '@/features/recipes/components/RecipeCardSkeleton'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import { cn } from '@/lib/utils'

const cardGridClass = [
  'grid w-full justify-center gap-3 sm:gap-4',
  '[grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),200px))]',
  '@min-[640px]:[grid-template-columns:repeat(auto-fit,minmax(280px,320px))]',
  '@min-[1040px]:[grid-template-columns:repeat(auto-fit,minmax(320px,360px))]',
].join(' ')

export const MyCookbookPage = () => {
  const { t, i18n } = useTranslation()
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

  const categoriesQuery = useQuery({
    queryKey: recipeQueryKeys.categories(),
    queryFn: () => recipesApi.listCategories(),
  })

  const listQuery = useQuery({
    queryKey: ['dishes', 'list', { scope, categoryId: categoryId ?? null, sort, order, page }],
    queryFn: () =>
      recipesApi.list({
        scope,
        categoryId,
        sort,
        order,
        limit: COOKBOOK_PAGE_SIZE,
        offset: (page - 1) * COOKBOOK_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  })

  const total = listQuery.data?.meta.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / COOKBOOK_PAGE_SIZE))
  const categories = [...(categoriesQuery.data?.data ?? [])].sort(
    (a, b) => a.order - b.order,
  )

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
        <div className="mt-3.5 flex flex-wrap" role="tablist" aria-label={t('cookbook.title')}>
          {COOKBOOK_SCOPES.map((item) => {
            const selected = scope === item
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => commit({ scope: item, page: 1 })}
                className={cn(
                  'cursor-pointer border-b-[1.5px] px-5 py-2 text-[13px] leading-5 whitespace-nowrap transition-colors',
                  selected
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent font-normal text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`cookbook.${cookbookScopeKey[item]}`)}
              </button>
            )
          })}
        </div>
      </header>

      <div className="border-b border-border bg-background px-5 pt-3 sm:px-7">
        <div className="flex flex-wrap gap-1.5 pb-3">
          <button
            type="button"
            onClick={() => commit({ category: undefined, page: 1 })}
            className={cn(
              'cursor-pointer rounded-full px-4 py-[7px] text-[13px] leading-5 whitespace-nowrap transition-colors',
              categoryId == null
                ? 'bg-primary font-semibold text-primary-foreground'
                : 'border border-border bg-card font-normal text-muted-foreground hover:bg-secondary',
            )}
          >
            {t('cookbook.all')}
          </button>
          {categories.map((category) => {
            const selected = categoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => commit({ category: category.id, page: 1 })}
                className={cn(
                  'cursor-pointer rounded-full px-4 py-[7px] text-[13px] leading-5 whitespace-nowrap transition-colors',
                  selected
                    ? 'bg-primary font-semibold text-primary-foreground'
                    : 'border border-border bg-card font-normal text-muted-foreground hover:bg-secondary',
                )}
              >
                {localizedName(i18n.language, category)}
              </button>
            )
          })}
        </div>
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
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-1.5">
          {COOKBOOK_SORT_CHIPS.map(({ key, icon: Icon }) => {
            const selected = sort === key
            const Arrow = order === DishListOrder.ASC ? ChevronUp : ChevronDown
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (selected) {
                    commit({
                      order:
                        order === DishListOrder.ASC
                          ? DishListOrder.DESC
                          : DishListOrder.ASC,
                      page: 1,
                    })
                  } else {
                    commit({ sort: key, order: DishListOrder.ASC, page: 1 })
                  }
                }}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-5 whitespace-nowrap transition-colors',
                  selected
                    ? 'bg-primary/15 font-medium text-primary'
                    : 'border border-border bg-card font-normal text-muted-foreground hover:bg-secondary',
                )}
              >
                <Icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                {t(`cookbook.filters.${key}`)}
                {selected ? (
                  <Arrow className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                ) : null}
              </button>
            )
          })}
        </div>
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
