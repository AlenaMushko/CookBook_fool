import { Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ListPagination } from '@components/common/ListPagination'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { RecipeSearchField } from '@/features/recipes/components/RecipeSearchField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'
import { DishCategoryChips, DishSortChips } from '@/features/recipes/components/dish-filters'
import { useDishCategories } from '@/features/recipes/hooks/useDishCategories'
import { useDishList } from '@/features/recipes/hooks/useDishList'
import { usePageForSearch, useRecipeSearch } from '@/features/recipes/hooks/useRecipeSearch'
import type { DishListCard } from '@/features/recipes/types/recipe.types'

import type { MenuStageDraft } from '../../types/menu.types'
import { RecipePickRow } from './RecipePickRow'

const PAGE_SIZE = 6

export const AddRecipesPanel = ({
  placedIds,
  targetName,
  sections = [],
  draggable = true,
  chooseStage = false,
  onAdd,
  onRemove,
}: {
  placedIds: ReadonlySet<string>
  targetName: string
  sections?: MenuStageDraft[]
  draggable?: boolean
  chooseStage?: boolean
  onAdd: (dish: DishListCard, sectionId?: string | null) => void
  onRemove: (dishId: string) => void
}) => {
  const { t } = useTranslation()
  const [pending, setPending] = useState<DishListCard | null>(null)
  const [sectionId, setSectionId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const activeSearch = useRecipeSearch(draft)
  const [categoryId, setCategoryId] = useState<string>()
  const [sort, setSort] = useState<DishListSort>(DishListSort.SAVED)
  const [order, setOrder] = useState<DishListOrder>(DishListOrder.DESC)
  const [page, setPage] = useState(1)
  const stages = sections.filter((section) => section.name.trim())
  const categories = useDishCategories()

  const closePicker = () => {
    setPending(null)
    setSectionId(null)
  }

  const place = (nextSectionId: string | null) => {
    if (!pending) return
    onAdd(pending, nextSectionId)
    closePicker()
  }
  const listPage = usePageForSearch(activeSearch, page, setPage)
  const { query, total, pageCount } = useDishList({
    scopeKey: ['menu-picker'],
    scope: DishListScope.COOKBOOK,
    categoryId,
    search: activeSearch,
    sort,
    order,
    page: listPage,
    pageSize: PAGE_SIZE,
  })

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
      <h2 className="font-serif text-[22px] text-foreground">{t('menus.detail.addRecipes')}</h2>
      <p className="mt-1 text-[12px] text-subtle">{t('menus.detail.addingTo', { name: targetName })}</p>
      <RecipeSearchField
        value={draft}
        onChange={setDraft}
        placeholder={t('cookbook.searchPlaceholder')}
        className="mt-3"
        containerClassName="w-full max-w-none bg-background md:max-w-none"
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
            onAdd={() => {
              if (chooseStage) {
                setSectionId(null)
                setPending(dish)
                return
              }
              onAdd(dish)
            }}
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
      <Dialog open={pending != null} onOpenChange={(open) => { if (!open) closePicker() }}>
        <DialogContent className="z-[80] max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t('menus.detail.addRecipe')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] leading-5 font-medium">{t('menus.addDish.stage')}</span>
              <Select
                value={sectionId}
                items={stages.map((stage) => ({ value: stage.id, label: stage.name }))}
                onValueChange={setSectionId}
                disabled={stages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      stages.length === 0
                        ? t('menus.detail.noStages')
                        : t('menus.addDish.stagePlaceholder')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="secondary" size="modal" onClick={closePicker}>
              {t('cancel')}
            </Button>
            <Button type="button" variant="secondary" size="modal" onClick={() => place(null)}>
              {t('menus.detail.addWithoutStage')}
            </Button>
            <Button type="button" size="modal" disabled={!sectionId} onClick={() => place(sectionId)}>
              {t('menus.detail.addPickedStage')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
