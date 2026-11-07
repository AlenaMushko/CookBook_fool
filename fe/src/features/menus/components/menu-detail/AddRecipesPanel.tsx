import { Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ListPagination } from '@components/common/ListPagination'
import { SearchInput } from '@components/ui/search-input'
import { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'
import { DishCategoryChips, DishSortChips } from '@/features/recipes/components/dish-filters'
import { useDishCategories } from '@/features/recipes/hooks/useDishCategories'
import { useDishList } from '@/features/recipes/hooks/useDishList'
import type { DishListCard } from '@/features/recipes/types/recipe.types'

import { RecipePickRow } from './RecipePickRow'

const PAGE_SIZE = 6

export const AddRecipesPanel = ({
  placedIds,
  targetName,
  draggable = true,
  onAdd,
  onRemove,
}: {
  placedIds: ReadonlySet<string>
  targetName: string
  draggable?: boolean
  onAdd: (dish: DishListCard) => void
  onRemove: (dishId: string) => void
}) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>()
  const [sort, setSort] = useState<DishListSort>(DishListSort.SAVED)
  const [order, setOrder] = useState<DishListOrder>(DishListOrder.DESC)
  const [page, setPage] = useState(1)
  const categories = useDishCategories()
  const { query, total, pageCount } = useDishList({
    scopeKey: ['menu-picker'],
    scope: DishListScope.COOKBOOK,
    categoryId,
    sort,
    order,
    page,
    pageSize: PAGE_SIZE,
  })

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
      <h2 className="font-serif text-[22px] text-foreground">{t('menus.detail.addRecipes')}</h2>
      <p className="mt-1 text-[12px] text-subtle">{t('menus.detail.addingTo', { name: targetName })}</p>
      <SearchInput
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('cookbook.searchPlaceholder')}
        aria-label={t('cookbook.searchPlaceholder')}
        containerClassName="mt-3 w-full max-w-none bg-background md:max-w-none"
      />
      <DishCategoryChips
        className="py-3"
        categories={categories}
        value={categoryId}
        onChange={(next) => {
          setCategoryId(next)
          setPage(1)
        }}
      />
      <DishSortChips
        sort={sort}
        order={order}
        onChange={(next) => {
          setSort(next.sort)
          setOrder(next.order)
          setPage(1)
        }}
      />
      {query.data ? (
        <p className="py-3 text-[13px] text-subtle">{t('cookbook.count', { count: total })}</p>
      ) : null}
      {query.isPending ? <div className="h-40 animate-pulse rounded-xl bg-background" /> : null}
      {query.isError ? <p className="text-[13px] text-muted-foreground">{t('cookbook.error')}</p> : null}
      {query.data && query.data.data.length === 0 ? (
        <p className="py-6 text-[13px] text-muted-foreground">{t('cookbook.empty')}</p>
      ) : null}
      <ul className="flex flex-col gap-2">
        {query.data?.data.map((dish) => (
          <RecipePickRow
            key={dish.id}
            dish={dish}
            placed={placedIds.has(dish.id)}
            draggable={draggable}
            onAdd={() => onAdd(dish)}
            onRemove={() => onRemove(dish.id)}
          />
        ))}
      </ul>
      <ListPagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        label={t('cookbook.pages')}
      />
      {draggable ? (
        <div className="mt-4 flex gap-2 rounded-xl bg-background px-3 py-3 text-[12px] leading-5 text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-subtle" strokeWidth={1.5} />
          <p>
            <span className="font-medium text-foreground">{t('menus.detail.dragNoteTitle')}. </span>
            {t('menus.detail.dragNote')}
          </p>
        </div>
      ) : null}
    </section>
  )
}
