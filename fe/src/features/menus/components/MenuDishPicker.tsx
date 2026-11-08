import { Link } from '@tanstack/react-router'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ListPagination } from '@components/common/ListPagination'
import { RecipeSearchField } from '@/features/recipes/components/RecipeSearchField'
import { DishDifficultyLevel, DishListOrder, DishListScope, DishListSort } from '@constants/recipe'
import { Routes } from '@constants/routes'
import {
  DishCategoryChips,
  DishScopeTabs,
  DishSortChips,
} from '@/features/recipes/components/dish-filters'
import { useDishCategories } from '@/features/recipes/hooks/useDishCategories'
import { useDishList } from '@/features/recipes/hooks/useDishList'
import { usePageForSearch, useRecipeSearch } from '@/features/recipes/hooks/useRecipeSearch'
import { RecipeImage } from '@/features/recipes/components/RecipeImage'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { formatMinutes } from '@/features/recipes/lib/recipe-measures'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import type { DishListCard } from '@/features/recipes/types/recipe.types'
import { cn } from '@/lib/utils'

import { coverUrl } from '../lib/cover-url'

const PAGE_SIZE = 6

export const MenuDishPicker = ({
  selectedIds,
  onToggle,
}: {
  selectedIds: ReadonlySet<string>
  onToggle: (dish: DishListCard) => void
}) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const activeSearch = useRecipeSearch(draft)
  const [scope, setScope] = useState<DishListScope>(DishListScope.PUBLIC)
  const [categoryId, setCategoryId] = useState<string>()
  const [sort, setSort] = useState<DishListSort>(DishListSort.SAVED)
  const [order, setOrder] = useState<DishListOrder>(DishListOrder.DESC)
  const [page, setPage] = useState(1)

  const categories = useDishCategories()
  const listPage = usePageForSearch(activeSearch, page, setPage)
  const { query: listQuery, total, pageCount } = useDishList({
    scopeKey: ['menu-picker'],
    scope,
    categoryId,
    search: activeSearch,
    sort,
    order,
    page: listPage,
    pageSize: PAGE_SIZE,
  })

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center">
        <DishScopeTabs
          className="shrink-0"
          tabClassName="px-3"
          value={scope}
          ariaLabel={t('menus.title')}
          onChange={(next) => {
            setScope(next)
            setPage(1)
          }}
        />
        <div className="flex w-full min-w-0 flex-1 lg:justify-end">
          <RecipeSearchField
            value={draft}
            onChange={setDraft}
            placeholder={t('cookbook.searchPlaceholder')}
            className="w-[80%]"
            containerClassName="w-full max-w-none bg-background md:w-full md:max-w-none"
          />
        </div>
      </div>

      <DishCategoryChips
        className="py-3"
        categories={categories}
        value={categoryId}
        surface="panel"
        onChange={(next) => {
          setCategoryId(next)
          setPage(1)
        }}
      />

      <DishSortChips
        className="border-b border-divider pb-3"
        sort={sort}
        order={order}
        surface="panel"
        onChange={(next) => {
          setSort(next.sort)
          setOrder(next.order)
          setPage(1)
        }}
      />

      {listQuery.data ? (
        <p className="py-3 text-[13px] text-subtle">{t('cookbook.count', { count: total })}</p>
      ) : null}

      {listQuery.isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-xl bg-background" />
          ))}
        </div>
      ) : null}
      {listQuery.isError ? (
        <p className="text-[13px] text-muted-foreground">{t('cookbook.error')}</p>
      ) : null}
      {listQuery.data && listQuery.data.data.length === 0 ? (
        <p className="py-6 text-[13px] text-muted-foreground">{t('cookbook.empty')}</p>
      ) : null}
      {listQuery.data && listQuery.data.data.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {listQuery.data.data.map((dish) => (
            <PickerCard
              key={dish.id}
              dish={dish}
              selected={selectedIds.has(dish.id)}
              onToggle={() => onToggle(dish)}
            />
          ))}
        </div>
      ) : null}

      <ListPagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        label={t('cookbook.pages')}
      />
    </section>
  )
}

const PickerCard = ({
  dish,
  selected,
  onToggle,
}: {
  dish: DishListCard
  selected: boolean
  onToggle: () => void
}) => {
  const { t, i18n } = useTranslation()
  const photo = coverUrl(dish)
  const servings =
    dish.baseServings && dish.baseServings >= 1 ? Math.round(dish.baseServings) : undefined
  const category = dish.category ? localizedName(i18n.language, dish.category) : ''

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-background',
        recipeCardInteractiveClass,
      )}
    >
      <Link
        to={Routes.RECIPE}
        params={{ recipeId: dish.id }}
        className="block cursor-pointer text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <div className="relative h-28 bg-secondary">
          <RecipeImage src={photo} className="size-full object-cover" />
        </div>
        <div className="px-3 py-2.5">
          {category ? (
            <p className="truncate text-[10px] leading-4 font-medium tracking-[0.6px] text-muted-foreground uppercase">
              {category}
            </p>
          ) : null}
          <h3 className="truncate font-serif text-[16px] leading-5 font-semibold">{dish.title}</h3>
          <p className="mt-1.5 flex items-center gap-2 text-[12px] text-muted-foreground">
            {servings ? <span>{t('cookbook.portions', { count: servings })}</span> : null}
            <DifficultyMarks
              level={DishDifficultyLevel[dish.difficulty]}
              label={t(`recipe.create.${dish.difficulty.toLowerCase()}`)}
            />
            {dish.cookTime ? <span>{formatMinutes(dish.cookTime, t)}</span> : null}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={t(selected ? 'menus.createPage.remove' : 'menus.createPage.add')}
        onClick={onToggle}
        className={cn(
          'absolute top-2 right-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full shadow-[0_1px_2px_rgba(43,38,32,0.16)] transition-[background-color,color,transform,box-shadow] duration-150 hover:scale-105 hover:shadow-[0_4px_10px_rgba(74,90,68,0.28)]',
          selected
            ? 'bg-brand text-white hover:bg-brand/90'
            : 'bg-card text-foreground hover:bg-primary hover:text-primary-foreground',
        )}
      >
        {selected ? (
          <Check className="size-3.5" strokeWidth={2} />
        ) : (
          <Plus className="size-3.5" strokeWidth={1.5} />
        )}
      </button>
    </article>
  )
}

const DifficultyMarks = ({ level, label }: { level: number; label: string }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={label}>
    {[1, 2, 3].map((mark) => (
      <span
        key={mark}
        className={cn('size-1.5 rounded-full', mark <= level ? 'bg-brand' : 'bg-border')}
      />
    ))}
  </span>
)
