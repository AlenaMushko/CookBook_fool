import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'
import { SearchInput } from '@components/ui/search-input'
import { DishListOrder, DishListScope, DishListSort } from '@constants/recipe'
import { Routes } from '@constants/routes'
import { HomeRecipeCard } from '@/features/home/components/HomeRecipeCard'
import { homeStateFromSearch, toHomeSearch } from '@/features/home/home-search'
import { useAuthSession } from '@/hooks/useAuthSession'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { formatMinutes } from '@/features/recipes/lib/recipe-measures'
import { localizedName } from '@/features/recipes/lib/recipe-locale'
import type { DishListCard, DishListResult } from '@/features/recipes/types/recipe.types'
import { cn } from '@/lib/utils'

import { HomeHero } from './HomeHero'

const PREVIEW_COUNT = 3
const MINE_COUNT = 2

type HomeMenu = {
  id: string
  name: string
  dishesCount: number
  covers: string[]
}

const homeList = (
  scope: DishListScope,
  sort: DishListSort,
  categoryId: string | undefined,
  limit: number,
) => ({
  queryKey: [
    'dishes',
    'list',
    'home',
    { scope, categoryId: categoryId ?? null, sort, order: DishListOrder.DESC, limit },
  ],
  queryFn: () =>
    recipesApi.list({
      scope,
      categoryId,
      sort,
      order: DishListOrder.DESC,
      limit,
      offset: 0,
    }),
  staleTime: Infinity,
  gcTime: 30 * 60 * 1000,
})

export const HomePage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthSession()
  const { q: search, category: categoryId } = homeStateFromSearch(
    useSearch({ from: '/(public)/' }),
  )
  const commit = useCallback(
    (next: { q: string; category?: string }) => {
      void navigate({
        to: Routes.HOME,
        search: toHomeSearch(next),
        replace: true,
      })
    },
    [navigate],
  )

  const categoriesQuery = useQuery({
    queryKey: recipeQueryKeys.categories(),
    queryFn: () => recipesApi.listCategories(),
  })
  const popularQuery = useQuery(
    homeList(DishListScope.PUBLIC, DishListSort.SAVED, categoryId, PREVIEW_COUNT),
  )
  const recentQuery = useQuery(
    homeList(DishListScope.PUBLIC, DishListSort.CREATED, categoryId, PREVIEW_COUNT),
  )
  const mineQuery = useQuery({
    ...homeList(
      DishListScope.CREATED_BY_ME,
      DishListSort.CREATED,
      categoryId,
      MINE_COUNT,
    ),
    enabled: isAuthenticated,
  })
  const menusQuery = useQuery({
    queryKey: ['menus', 'home'],
    queryFn: () => apiJson<{ data: HomeMenu[] }>(ApiRoutes.menu.all),
    enabled: isAuthenticated,
    staleTime: Infinity,
  })

  const categories = [...(categoriesQuery.data?.data ?? [])].sort(
    (a, b) => a.order - b.order,
  )

  return (
    <div className="-m-5 flex flex-col">
      <HomeHero />
      <div className="flex flex-col gap-8 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-4">
          <SearchInput
            value={search}
            onChange={(event) => commit({ q: event.target.value, category: categoryId })}
            placeholder={t('homePage.searchPlaceholder')}
            aria-label={t('homePage.searchPlaceholder')}
            containerClassName="w-full max-w-none bg-card md:w-full"
          />
          <div className="flex flex-wrap gap-1.5">
            <CategoryChip
              selected={categoryId == null}
              onClick={() => commit({ q: search, category: undefined })}
            >
              {t('cookbook.all')}
            </CategoryChip>
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                selected={categoryId === category.id}
                onClick={() => commit({ q: search, category: category.id })}
              >
                {localizedName(i18n.language, category)}
              </CategoryChip>
            ))}
          </div>
        </div>

        <RecipeSection
          title={t('homePage.popular')}
          viewAll={t('homePage.viewAll')}
          dishes={popularQuery.data?.data}
          pending={popularQuery.isPending}
          empty={t('homePage.emptyRecipes')}
        />
        <RecipeSection
          title={t('homePage.recent')}
          viewAll={t('homePage.viewAll')}
          dishes={recentQuery.data?.data}
          pending={recentQuery.isPending}
          empty={t('homePage.emptyRecipes')}
        />

        {isAuthenticated ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <MineSection
              title={t('homePage.myCookbook')}
              to={Routes.MY_COOKBOOK}
              seeAll={t('homePage.seeAll')}
              empty={t('homePage.emptyMine')}
              pending={mineQuery.isPending}
              dishes={mineQuery.data?.data ?? []}
            />
            <MenuSection
              title={t('homePage.myMenus')}
              seeAll={t('homePage.seeAll')}
              empty={t('homePage.emptyMenus')}
              pending={menusQuery.isPending}
              menus={(menusQuery.data?.data ?? []).slice(0, MINE_COUNT)}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

const CategoryChip = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: string
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-full px-4 py-[7px] text-[13px] leading-5 whitespace-nowrap transition-colors',
        selected
          ? 'bg-primary font-semibold text-primary-foreground'
          : 'border border-border bg-card font-normal text-muted-foreground hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

const SectionHeading = ({
  title,
  to,
  action,
}: {
  title: string
  to: typeof Routes.MY_COOKBOOK | typeof Routes.MENUS
  action: string
}) => {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="font-serif text-[26px] leading-8 font-normal text-foreground">
        {title}
      </h2>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-brand"
      >
        {action}
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

const RecipeSection = ({
  title,
  viewAll,
  dishes,
  pending,
  empty,
}: {
  title: string
  viewAll: string
  dishes?: DishListResult['data']
  pending: boolean
  empty: string
}) => {
  return (
    <section>
      <SectionHeading title={title} to={Routes.MY_COOKBOOK} action={viewAll} />
      {pending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PREVIEW_COUNT }, (_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : null}
      {dishes && dishes.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">{empty}</p>
      ) : null}
      {dishes && dishes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <HomeRecipeCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

const MineSection = ({
  title,
  to,
  seeAll,
  empty,
  pending,
  dishes,
}: {
  title: string
  to: typeof Routes.MY_COOKBOOK
  seeAll: string
  empty: string
  pending: boolean
  dishes: DishListCard[]
}) => {
  const { t } = useTranslation()

  return (
    <section>
      <SectionHeading title={title} to={to} action={seeAll} />
      {pending ? <div className="h-28 animate-pulse rounded-2xl bg-card" /> : null}
      {!pending && dishes.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">{empty}</p>
      ) : null}
      {dishes.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {dishes.map((dish) => {
            const cover = [...(dish.photos ?? [])].sort((a, b) => a.order - b.order)[0]
            return (
              <Link
                key={dish.id}
                to={Routes.RECIPE}
                params={{ recipeId: dish.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-background">
                  {cover?.url ? (
                    <img src={cover.url} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-serif text-[16px] leading-5 font-semibold">
                    {dish.title}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {[
                      dish.cookTime ? formatMinutes(dish.cookTime, t) : '',
                      t(`recipe.create.${dish.difficulty.toLowerCase()}`),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

const MenuSection = ({
  title,
  seeAll,
  empty,
  pending,
  menus,
}: {
  title: string
  seeAll: string
  empty: string
  pending: boolean
  menus: HomeMenu[]
}) => {
  const { t } = useTranslation()

  return (
    <section>
      <SectionHeading title={title} to={Routes.MENUS} action={seeAll} />
      {pending ? <div className="h-28 animate-pulse rounded-2xl bg-card" /> : null}
      {!pending && menus.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">{empty}</p>
      ) : null}
      {menus.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              to={Routes.MENU}
              params={{ menuId: menu.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
            >
              <div className="grid size-14 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-lg bg-background">
                {menu.covers.slice(0, 4).map((url) => (
                  <img key={url} src={url} alt="" className="size-full object-cover" />
                ))}
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-[16px] leading-5 font-semibold">
                  {menu.name}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {t('homePage.recipes', { count: menu.dishesCount })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  )
}
