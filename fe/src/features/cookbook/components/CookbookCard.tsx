import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Bookmark, ChefHat, Clock, Soup } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@api/queryClient'
import { Spinner } from '@components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip'
import { DishDifficultyLevel, DishListScope } from '@constants/recipe'
import { Routes } from '@constants/routes'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { formatMinutes } from '@/features/recipes/lib/recipe-measures'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import type {
  DishDetails,
  DishListCard,
  DishListResult,
} from '@/features/recipes/types/recipe.types'
import { showToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export const CookbookCard = ({
  dish,
  layout = 'grid',
}: {
  dish: DishListCard
  layout?: 'grid' | 'list'
}) => {
  const { t, i18n } = useTranslation()
  const { user } = useCurrentUser()
  const cover = [...(dish.photos ?? [])].sort((a, b) => a.order - b.order)[0]
  const totalTime = dish.cookTime ?? 0
  const servings =
    dish.baseServings && dish.baseServings >= 1
      ? Math.round(dish.baseServings)
      : undefined
  const difficulty = DishDifficultyLevel[dish.difficulty]
  const saved = Boolean(dish.isLiked)
  const mine = user?.id
    ? dish.owner?.id === user.id
    : dish.isOwner === true
  const author = [dish.owner?.firstName, dish.owner?.lastName].filter(Boolean).join(' ')

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
      if (!nextSaved) showToast(t('cookbook.unsaved'), 'success')
      const cachedLists = queryClient.getQueriesData<DishListResult>({
        queryKey: ['dishes', 'list'],
      })
      for (const [key, current] of cachedLists) {
        if (!current) continue
        const scope = (key[2] as { scope?: string } | undefined)?.scope
        const dropFromSaved = scope === DishListScope.SAVED && !nextSaved
        const data = current.data.flatMap((item) => {
          if (item.id !== dish.id) return [item]
          if (dropFromSaved) return []
          return [{ ...item, isLiked: nextSaved }]
        })
        const removed = data.length < current.data.length
        queryClient.setQueryData<DishListResult>(key, {
          ...current,
          data,
          meta: removed
            ? { ...current.meta, total: Math.max(0, current.meta.total - 1) }
            : current.meta,
        })
      }
      queryClient.setQueryData<DishDetails>(recipeQueryKeys.dish(dish.id), (current) => {
        if (!current) return current
        const delta = Number(nextSaved) - Number(Boolean(current.isLiked))
        return {
          ...current,
          isLiked: nextSaved,
          likesCount: Math.max(0, current.likesCount + delta),
        }
      })
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    },
  })

  const saveButton = mine ? null : (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-pressed={saved}
            aria-label={t('recipe.details.save')}
            disabled={toggleSave.isPending}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              toggleSave.mutate(!saved)
            }}
            className={cn(
              'absolute z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-card/95 text-foreground shadow-[0_1px_2px_rgba(43,38,32,0.12)] transition-colors duration-150 hover:bg-card disabled:cursor-wait disabled:opacity-70',
              layout === 'list' ? 'top-1/2 right-3 -translate-y-1/2' : 'top-2 right-2',
            )}
          >
            <Bookmark
              className={cn(
                'size-4 transition-colors duration-200',
                saved ? 'fill-current text-brand' : 'fill-none',
              )}
              strokeWidth={1.5}
            />
          </button>
        }
      />
      <TooltipContent side="bottom">
        {t(saved ? 'recipe.details.savedHint' : 'recipe.details.saveHint')}
      </TooltipContent>
    </Tooltip>
  )

  const cardLoader = toggleSave.isPending ? (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/60">
      <Spinner className="text-primary" />
    </div>
  ) : null

  const meta = (
    <div className="flex items-center gap-2.5 pt-2 text-[11px] leading-4 text-muted-foreground">
      {servings ? (
        <span className="inline-flex items-center gap-1">
          <Soup className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          {t('cookbook.portions', { count: servings })}
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-1"
        aria-label={t(`recipe.create.${dish.difficulty.toLowerCase()}`)}
      >
        <ChefHat className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="flex items-center gap-0.5" aria-hidden>
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={cn(
                'size-1.5 rounded-full',
                dot <= difficulty ? 'bg-brand' : 'bg-border',
              )}
            />
          ))}
        </span>
      </span>
      {totalTime > 0 ? (
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          {formatMinutes(totalTime, t)}
        </span>
      ) : null}
    </div>
  )

  if (layout === 'list') {
    return (
      <article
        aria-busy={toggleSave.isPending}
        className="relative flex w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(43,38,32,0.06)]"
      >
        <Link
          to={Routes.RECIPE}
          params={{ recipeId: dish.id }}
          className="flex min-w-0 flex-1 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <div className="relative h-24 w-28 shrink-0 bg-background sm:h-[104px] sm:w-36">
            {cover?.url ? (
              <img src={cover.url} alt="" className="size-full object-cover" />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2 pr-12">
            {categoryLine ? (
              <p className="truncate text-[10px] leading-4 font-medium tracking-[0.6px] text-muted-foreground uppercase">
                {categoryLine}
              </p>
            ) : null}
            <h2 className="truncate font-serif text-[15px] leading-5 font-semibold text-foreground">
              {dish.title}
            </h2>
            {!mine && author ? (
              <p className="truncate text-[12px] leading-4 font-semibold text-brand">
                {author}
              </p>
            ) : null}
            {meta}
          </div>
        </Link>
        {saveButton}
        {cardLoader}
      </article>
    )
  }

  return (
    <article
      aria-busy={toggleSave.isPending}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(43,38,32,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_16px_rgba(43,38,32,0.08)]"
    >
      <Link
        to={Routes.RECIPE}
        params={{ recipeId: dish.id }}
        className="flex min-h-0 min-w-0 flex-1 flex-col text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <div className="relative h-[128px] shrink-0 bg-background @min-[640px]:h-[148px] @min-[1040px]:h-[168px]">
          {cover?.url ? (
            <img src={cover.url} alt="" className="size-full object-cover" />
          ) : null}
        </div>
        <div
          className={cn(
            'relative z-10 flex flex-1 flex-col bg-card px-3 pt-2 pb-2.5 transition-[margin-top] duration-200 ease-out',
            dish.description && 'group-hover:-mt-16 max-lg:group-hover:mt-0',
          )}
        >
          {categoryLine ? (
            <p className="truncate text-[10px] leading-4 font-medium tracking-[0.6px] text-muted-foreground uppercase">
              {categoryLine}
            </p>
          ) : null}
          <h2 className="truncate font-serif text-[15px] leading-5 font-semibold text-foreground @min-[1040px]:text-[17px] @min-[1040px]:leading-6">
            {dish.title}
          </h2>
          {dish.description ? (
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows,margin-top] duration-200 ease-out group-hover:mt-1 group-hover:grid-rows-[1fr] max-lg:hidden">
              <div className="min-h-0 overflow-hidden">
                <p className="line-clamp-3 h-[3.75rem] text-[13px] leading-5 text-muted-foreground">
                  {dish.description}
                </p>
              </div>
            </div>
          ) : null}
          {!mine && author ? (
            <p className="truncate text-[12px] leading-4 font-semibold text-brand">
              {author}
            </p>
          ) : null}
          <div className="mt-auto">{meta}</div>
        </div>
      </Link>
      {saveButton}
      {cardLoader}
    </article>
  )
}
