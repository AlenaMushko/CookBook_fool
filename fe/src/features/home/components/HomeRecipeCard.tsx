import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Bookmark, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Spinner } from '@components/ui/spinner'
import { Routes } from '@constants/routes'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { syncDishSaved } from '@/features/recipes/lib/sync-dish-saved'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { formatMinutes } from '@/features/recipes/lib/recipe-measures'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import type { DishListCard } from '@/features/recipes/types/recipe.types'
import { showToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export const HomeRecipeCard = ({ dish }: { dish: DishListCard }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthSession()
  const { user } = useCurrentUser()
  const cover = [...(dish.photos ?? [])].sort((a, b) => a.order - b.order)[0]
  const servings =
    dish.baseServings && dish.baseServings >= 1
      ? Math.round(dish.baseServings)
      : undefined
  const mine = user?.id ? dish.owner?.id === user.id : dish.isOwner === true
  const saved = Boolean(dish.isLiked)
  const categoryLine = [
    dish.category ? localizedName(i18n.language, dish.category) : '',
    dish.subcategory ? localizedName(i18n.language, dish.subcategory) : '',
  ]
    .filter(Boolean)
    .join(' · ')

  const toggleSave = useMutation({
    meta: { skipGlobalLoader: true },
    mutationFn: (nextSaved: boolean) =>
      nextSaved ? recipesApi.like(dish.id) : recipesApi.unlike(dish.id),
    onSuccess: (_result, nextSaved) => {
      syncDishSaved(dish.id, nextSaved)
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    },
  })

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(43,38,32,0.06)]',
        recipeCardInteractiveClass,
      )}
    >
      <Link
        to={Routes.RECIPE}
        params={{ recipeId: dish.id }}
        className="flex min-h-0 flex-1 cursor-pointer flex-col text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <div className="relative h-40 bg-background">
          {cover?.url ? (
            <img src={cover.url} alt="" className="size-full object-cover" />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
          {categoryLine ? (
            <p className="truncate text-[10px] leading-4 font-medium tracking-[0.6px] text-muted-foreground uppercase">
              {categoryLine}
            </p>
          ) : null}
          <h3 className="mt-1 font-serif text-[18px] leading-6 font-semibold">
            {dish.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[12px] leading-5 text-foreground">
              {t(`recipe.create.${dish.difficulty.toLowerCase()}`)}
            </span>
            {dish.cookTime ? (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[12px] leading-5 text-foreground">
                {formatMinutes(dish.cookTime, t)}
              </span>
            ) : null}
            {servings ? (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[12px] leading-5 text-foreground">
                {t('homePage.servings', { count: servings })}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-3 px-3.5 pb-3.5">
        <p className="text-[12px] leading-4 text-muted-foreground">
          {t('homePage.saves', { count: dish.likesCount ?? 0 })}
        </p>
        <Button
          render={
            <Link to={isAuthenticated ? Routes.MENUS : Routes.LOGIN} />
          }
          className="h-8 min-h-0 px-3 text-[12px]"
        >
          <Plus className="size-3.5" strokeWidth={1.5} />
          {t('homePage.addToMenu')}
        </Button>
      </div>
      {mine ? null : (
        <button
          type="button"
          aria-pressed={saved}
          aria-label={t('recipe.details.save')}
          disabled={toggleSave.isPending}
          onClick={() => {
            if (!isAuthenticated) {
              void navigate({ to: Routes.LOGIN })
              return
            }
            toggleSave.mutate(!saved)
          }}
          className="absolute top-2.5 right-2.5 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-card/95 text-foreground shadow-[0_1px_2px_rgba(43,38,32,0.12)] disabled:cursor-wait"
        >
          <Bookmark
            className={cn('size-4', saved ? 'fill-current text-brand' : 'fill-none')}
            strokeWidth={1.5}
          />
        </button>
      )}
      {toggleSave.isPending ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
          <Spinner className="text-primary" />
        </div>
      ) : null}
    </article>
  )
}
