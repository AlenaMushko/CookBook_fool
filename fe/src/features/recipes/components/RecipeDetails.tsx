import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Bookmark,
  ChefHat,
  ChevronLeft,
  Clock,
  Minus,
  Pencil,
  Plus,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@api/queryClient'
import { Button } from '@components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip'
import { DishDifficultyLevel, MAX_SERVINGS } from '@constants/recipe'
import { Routes } from '@constants/routes'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { showToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { recipesApi } from '../api/recipes.api'
import { recipeQueryKeys } from '../api/recipes.queries'
import { formatAmount, formatMinutes } from '../lib/recipe-measures'
import { localizedName, unitSymbol } from '../lib/recipe-locale'
import type { DishDetails, DishPhotoRef, MeasurementUnit } from '../types/recipe.types'
import { RecipePhotoViewer } from './RecipePhotoViewer'

export const RecipeDetails = ({
  dish,
  units,
}: {
  dish: DishDetails
  units: MeasurementUnit[]
}) => {
  const { t, i18n } = useTranslation()
  const { isAuthenticated } = useAuthSession()
  const { user } = useCurrentUser()
  const isOwner = dish.isOwner === true || user?.id === dish.owner.id
  const gallery = useMemo(
    () => [...(dish.photos ?? [])].sort((a, b) => a.order - b.order),
    [dish.photos],
  )
  const [activePhoto, setActivePhoto] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [panel, setPanel] = useState<'ingredients' | 'instructions'>('ingredients')
  const baseServings =
    dish.baseServings && dish.baseServings >= 1 ? Math.round(dish.baseServings) : 6
  const [servings, setServings] = useState(baseServings)
  const [liked, setLiked] = useState(Boolean(dish.isLiked))

  const unitById = useMemo(
    () => new Map(units.map((unit) => [unit.id, unit])),
    [units],
  )
  const scale = servings / baseServings
  const hero = gallery[activePhoto] ?? gallery[0]
  const totalTime = dish.cookTime ?? 0
  const categoryLine = [
    localizedName(i18n.language, dish.category),
    dish.subcategory ? localizedName(i18n.language, dish.subcategory) : '',
  ]
    .filter(Boolean)
    .join(' · ')
  const author = [dish.owner.firstName, dish.owner.lastName].filter(Boolean).join(' ')
  const steps = useMemo(
    () => [...dish.steps].sort((a, b) => a.order - b.order),
    [dish.steps],
  )
  const album = useMemo(() => {
    return [
      ...gallery,
      ...steps.flatMap((step) =>
        [...(step.photos ?? [])].sort((a, b) => a.order - b.order),
      ),
    ].filter((photo) => photo.url)
  }, [gallery, steps])

  const groups = useMemo(() => {
    const ordered = [...dish.ingredients].sort((a, b) => a.order - b.order)
    const named = [...dish.ingredientGroups].sort((a, b) => a.order - b.order)
    const sections = named
      .map((group) => ({
        id: group.id,
        name: group.name,
        items: ordered.filter((item) => item.groupId === group.id),
      }))
      .filter((section) => section.items.length > 0)
    const ungrouped = ordered.filter(
      (item) => !item.groupId || !named.some((group) => group.id === item.groupId),
    )
    if (ungrouped.length > 0) {
      sections.push({ id: 'ungrouped', name: undefined, items: ungrouped })
    }
    if (sections.length === 0 && ordered.length > 0) {
      sections.push({ id: 'all', name: undefined, items: ordered })
    }
    return sections
  }, [dish.ingredientGroups, dish.ingredients])

  const likeMutation = useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? recipesApi.like(dish.id) : recipesApi.unlike(dish.id),
    onSuccess: (_result, nextLiked) => {
      setLiked(nextLiked)
      void queryClient.invalidateQueries({ queryKey: recipeQueryKeys.dish(dish.id) })
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    },
  })

  const save = () => {
    if (!isAuthenticated) {
      showToast(t('recipe.details.loginToSave'), 'info')
      return
    }
    if (likeMutation.isPending) return
    likeMutation.mutate(!liked)
  }

  const openPhoto = (photo: DishPhotoRef) => {
    const index = album.findIndex((item) => item.key === photo.key)
    if (index < 0) return
    const galleryIndex = gallery.findIndex((item) => item.key === photo.key)
    if (galleryIndex >= 0) setActivePhoto(galleryIndex)
    setViewerIndex(index)
  }

  const closeViewer = useCallback(() => setViewerIndex(null), [])

  const ingredientsCard = (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-[26px] leading-8 font-medium text-foreground">
          {t('recipe.create.ingredients')}
        </h2>
        <p className="shrink-0 text-[13px] text-subtle">
          {t('recipe.details.forServings', { count: servings })}
        </p>
      </header>
      <div className="mt-4 flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.id}>
            {group.name ? (
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.07em] text-brand uppercase">
                {group.name}
              </p>
            ) : null}
            <ul className="flex flex-col gap-3">
              {group.items.map((item) => {
                const unit = unitById.get(item.unitId)
                const amount = [
                  formatAmount(item.quantity * scale),
                  unit ? unitSymbol(i18n.language, unit) : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <li key={item.id} className="flex items-center gap-3 text-[15px]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="size-9 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="size-9 shrink-0 rounded-lg bg-muted" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      {localizedName(i18n.language, item)}
                    </span>
                    <span className="shrink-0 text-muted-foreground">{amount}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )

  const instructionsCard = (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-[26px] leading-8 font-medium text-foreground">
        {t('recipe.create.instructions')}
      </h2>
      <ol className="mt-5">
        {steps.map((step, index) => {
          const photos = [...(step.photos ?? [])].sort((a, b) => a.order - b.order)
          const last = index === steps.length - 1
          return (
            <li key={step.order} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-medium text-white">
                  {index + 1}
                </span>
                {last ? null : <span className="my-1 w-px flex-1 bg-divider" />}
              </div>
              <div
                className={cn(
                  'flex min-w-0 flex-1 gap-3',
                  last ? 'pb-0' : 'pb-5',
                )}
              >
                <div className="min-w-0 flex-1 pt-1 text-[14px] leading-6">
                  {step.title ? <p className="font-medium">{step.title}</p> : null}
                  {step.description ? <p>{step.description}</p> : null}
                </div>
                {photos.length > 0 ? (
                  <div className="flex shrink-0 flex-col gap-2">
                    {photos.map((photo) => (
                      <button
                        key={photo.key}
                        type="button"
                        aria-label={t('recipe.details.openPhoto')}
                        onClick={() => openPhoto(photo)}
                        className="size-16 cursor-pointer overflow-hidden rounded-lg transition-opacity duration-150 hover:opacity-80"
                      >
                        {photo.url ? (
                          <img src={photo.url} alt="" className="size-full object-cover" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )

  return (
    <article className="mx-auto flex w-full max-w-[1040px] flex-col pb-8 text-foreground">
      <div className="relative h-[240px] overflow-hidden rounded-2xl md:h-[360px]">
        {hero?.url ? (
          <img src={hero.url} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-muted" />
        )}
        <Link
          to={Routes.RECIPES}
          aria-label={t('recipe.details.library')}
          className="absolute top-3 left-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-card/90 text-foreground transition-colors duration-150 hover:bg-card"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </Link>
        {isOwner ? null : (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-pressed={liked}
                  aria-label={t('recipe.details.save')}
                  disabled={likeMutation.isPending}
                  onClick={save}
                  className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-card/90 text-foreground transition-colors duration-150 hover:bg-card disabled:cursor-wait disabled:opacity-70"
                >
                  <Bookmark
                    className={cn('size-4', liked && 'fill-current')}
                    strokeWidth={1.5}
                  />
                </button>
              }
            />
            <TooltipContent side="bottom">
              {t(liked ? 'recipe.details.savedHint' : 'recipe.details.saveHint')}
            </TooltipContent>
          </Tooltip>
        )}
        {gallery.length > 0 ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {gallery.slice(0, 3).map((photo) => (
              <button
                key={photo.key}
                type="button"
                aria-label={t('recipe.details.openPhoto')}
                onClick={() => openPhoto(photo)}
                className={cn(
                  'h-[54px] w-[76px] cursor-pointer overflow-hidden rounded-md border-2 transition-[border-color,opacity] duration-150 hover:border-white hover:opacity-100',
                  photo.key === hero?.key
                    ? 'border-white opacity-100'
                    : 'border-white/55 opacity-90',
                )}
              >
                {photo.url ? (
                  <img src={photo.url} alt="" className="size-full object-cover" />
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="pt-5">
        {categoryLine ? (
          <p className="text-[11px] font-bold tracking-[0.07em] text-[#8b9683] uppercase">
            {categoryLine}
          </p>
        ) : null}
        <h1 className="mt-1 font-serif text-[32px] leading-9 font-medium text-foreground">
          {dish.title}
        </h1>
        {dish.description ? (
          <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-subtle">
            {dish.description}
          </p>
        ) : null}
        <p className="pt-1 text-[13px] leading-5 text-subtle">
          {t('recipe.details.byPrefix')}{' '}
          <span className="font-semibold text-brand">{author}</span>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-brand" strokeWidth={1.5} />
          <div>
            <p className="text-[14px] leading-5 font-medium">
              {formatMinutes(totalTime || undefined, t)}
            </p>
            <p className="text-[12px] leading-4 text-subtle">
              {t('recipe.details.totalTime')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="size-5 text-brand" strokeWidth={1.5} />
          <div>
            <p className="text-[14px] leading-5 font-medium">
              {t(`recipe.create.${dish.difficulty.toLowerCase()}`)}
            </p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3].map((level) => (
                <span
                  key={level}
                  className={cn(
                    'size-1.5 rounded-full',
                    level <= DishDifficultyLevel[dish.difficulty]
                      ? 'bg-brand'
                      : 'bg-border',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="size-5 text-brand" strokeWidth={1.5} />
          <div>
            <p className="text-[14px] leading-5 font-medium">{dish.likesCount}</p>
            <p className="text-[12px] leading-4 text-subtle">
              {t('recipe.details.savedBy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-[10px] font-medium tracking-[0.08em] text-subtle uppercase">
            {t('recipe.details.servings')}
          </span>
          <button
            type="button"
            aria-label={t('recipe.details.servingsDecrease')}
            disabled={servings <= 1}
            onClick={() => setServings((current) => Math.max(1, current - 1))}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-3.5" strokeWidth={1.5} />
          </button>
          <span className="min-w-4 text-center text-[15px] font-medium">
            {formatAmount(servings)}
          </span>
          <button
            type="button"
            aria-label={t('recipe.details.servingsIncrease')}
            disabled={servings >= MAX_SERVINGS}
            onClick={() =>
              setServings((current) => Math.min(MAX_SERVINGS, current + 1))
            }
            className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-border transition-colors duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1 lg:hidden">
        {(['ingredients', 'instructions'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPanel(item)}
            className={cn(
              'cursor-pointer rounded-full px-3 py-2 text-[14px] font-medium transition-colors duration-150',
              panel === item
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary-hover',
            )}
          >
            {t(
              item === 'ingredients'
                ? 'recipe.create.ingredients'
                : 'recipe.create.instructions',
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <div className={cn(panel !== 'ingredients' && 'max-lg:hidden')}>
          {ingredientsCard}
        </div>
        <div className={cn(panel !== 'instructions' && 'max-lg:hidden')}>
          {instructionsCard}
        </div>
      </div>

      {isOwner ? (
        <Button
          size="lg"
          className="mt-6 w-full bg-brand text-white hover:bg-brand-active"
          render={<Link to={Routes.RECIPE_EDIT} params={{ recipeId: dish.id }} />}
        >
          <Pencil strokeWidth={1.5} />
          {t('recipe.details.edit')}
        </Button>
      ) : null}

      {viewerIndex !== null ? (
        <RecipePhotoViewer
          photos={album}
          index={viewerIndex}
          onClose={closeViewer}
          onIndexChange={setViewerIndex}
        />
      ) : null}
    </article>
  )
}
