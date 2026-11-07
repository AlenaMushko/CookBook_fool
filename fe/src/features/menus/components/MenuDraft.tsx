import { Link } from '@tanstack/react-router'
import { Broom, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { RecipeImage } from '@/features/recipes/components/RecipeImage'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { formatMinutes } from '@/features/recipes/lib/recipe-measures'
import { cn } from '@/lib/utils'
import type { DishListCard } from '@/features/recipes/types/recipe.types'

import { coverUrl } from '../lib/cover-url'

export const MenuDraft = ({
  dishes,
  pending,
  canSubmit,
  onRemove,
  onClear,
  onSaveDraft,
}: {
  dishes: DishListCard[]
  pending: boolean
  canSubmit: boolean
  onRemove: (dishId: string) => void
  onClear: () => void
  onSaveDraft: () => void
}) => {
  const { t } = useTranslation()

  return (
    <aside className="flex flex-col rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-4 lg:self-start">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-[22px] leading-7 font-normal">{t('menus.createPage.draftTitle')}</h2>
        <p className="text-[12px] text-muted-foreground">
          {t('cookbook.count', { count: dishes.length })}
        </p>
      </div>

      {dishes.length === 0 ? (
        <p className="py-8 text-center text-[13px] leading-5 text-muted-foreground">
          {t('menus.createPage.emptyDraft')}
        </p>
      ) : (
        <ul className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
          {dishes.map((dish) => {
            const photo = coverUrl(dish)
            const servings =
              dish.baseServings && dish.baseServings >= 1
                ? Math.round(dish.baseServings)
                : undefined
            return (
              <li
                key={dish.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border border-border bg-background p-2',
                  recipeCardInteractiveClass,
                )}
              >
                <Link
                  to={Routes.RECIPE}
                  params={{ recipeId: dish.id }}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-foreground"
                >
                  <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <RecipeImage src={photo} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] leading-5 font-medium">{dish.title}</p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {[
                        servings ? t('cookbook.portions', { count: servings }) : '',
                        dish.cookTime ? formatMinutes(dish.cookTime, t) : '',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label={t('menus.createPage.remove')}
                  onClick={() => onRemove(dish.id)}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-150 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={onClear}
          className="h-auto min-h-10 whitespace-normal px-2 py-2 text-center text-[12px]"
        >
          <Broom strokeWidth={1.5} className="size-3.5" />
          {t('menus.createPage.clear')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={onSaveDraft}
          className="h-auto min-h-10 whitespace-normal px-2 py-2 text-center text-[12px]"
        >
          <Save strokeWidth={1.5} className="size-3.5" />
          {t('menus.createPage.saveDraft')}
        </Button>
      </div>
      <Button
        type="submit"
        isLoading={pending}
        disabled={!canSubmit}
        className="mt-2 h-11 w-full"
      >
        {t('menus.createPage.submit')}
      </Button>
    </aside>
  )
}
