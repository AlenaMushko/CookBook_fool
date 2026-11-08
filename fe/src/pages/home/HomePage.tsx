import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ApiRoutes } from "@api/apiRoutes";
import { apiJson } from "@api/client";
import { RecipeSearchField } from "@/features/recipes/components/RecipeSearchField";
import { DishListOrder, DishListScope, DishListSort } from "@constants/recipe";
import { Routes } from "@constants/routes";
import { HomeRecipeCard } from "@/features/home/components/HomeRecipeCard";
import { homeStateFromSearch, toHomeSearch } from "@/features/home/home-search";
import type { MenuPreview } from "@/features/menus/types/menu.types";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useViewerKey } from "@/lib/session-user";
import { recipesApi } from "@/features/recipes/api/recipes.api";
import { RecipeImage } from "@/features/recipes/components/RecipeImage";
import { DishCategoryChips } from "@/features/recipes/components/dish-filters";
import { useDishCategories } from "@/features/recipes/hooks/useDishCategories";
import { useRecipeSearch } from "@/features/recipes/hooks/useRecipeSearch";
import { recipeCardInteractiveClass } from "@/features/recipes/lib/recipe-card";
import { formatMinutes } from "@/features/recipes/lib/recipe-measures";
import type {
  DishListCard,
  DishListResult,
} from "@/features/recipes/types/recipe.types";
import { cn } from "@/lib/utils";

import { HomeHero } from "./HomeHero";

const PREVIEW_COUNT = 3;
const MINE_COUNT = 2;

const homeList = (
  viewer: string,
  scope: DishListScope,
  sort: DishListSort,
  categoryId: string | undefined,
  limit: number,
  search?: string
) => ({
  queryKey: [
    "dishes",
    "list",
    "home",
    viewer,
    {
      scope,
      categoryId: categoryId ?? null,
      sort,
      order: DishListOrder.DESC,
      limit,
      search: search || null,
    },
  ],
  queryFn: () =>
    recipesApi.list({
      scope,
      categoryId,
      search: search || undefined,
      sort,
      order: DishListOrder.DESC,
      limit,
      offset: 0,
    }),
  staleTime: Infinity,
  gcTime: 30 * 60 * 1000,
  meta: { skipGlobalLoader: true },
});

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();
  const viewer = useViewerKey();
  const accountReady = isAuthenticated && viewer != null;
  const homeSearch = useSearch({ from: "/(public)/" });
  const { q: search, category: categoryId } = homeStateFromSearch(homeSearch);
  const [draft, setDraft] = useState(search);
  const activeSearch = useRecipeSearch(draft);
  const isSearching = activeSearch.length > 0;
  const commit = useCallback(
    (next: { q: string; category?: string }) => {
      void navigate({
        to: Routes.HOME,
        search: toHomeSearch(next),
        replace: true,
      });
    },
    [navigate]
  );

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (activeSearch === search) return;
    commit({ q: activeSearch, category: categoryId });
  }, [activeSearch, categoryId, commit, search]);

  const categories = useDishCategories();
  const popularQuery = useQuery({
    ...homeList(
      viewer ?? "pending",
      DishListScope.PUBLIC,
      DishListSort.SAVED,
      categoryId,
      PREVIEW_COUNT
    ),
    enabled: viewer != null && !isSearching,
  });
  const recentQuery = useQuery({
    ...homeList(
      viewer ?? "pending",
      DishListScope.PUBLIC,
      DishListSort.CREATED,
      categoryId,
      PREVIEW_COUNT
    ),
    enabled: viewer != null && !isSearching,
  });
  const resultsQuery = useQuery({
    ...homeList(
      viewer ?? "pending",
      DishListScope.PUBLIC,
      DishListSort.SAVED,
      categoryId,
      12,
      activeSearch
    ),
    enabled: viewer != null && isSearching,
  });
  const mineQuery = useQuery({
    ...homeList(
      viewer ?? "pending",
      DishListScope.CREATED_BY_ME,
      DishListSort.CREATED,
      categoryId,
      MINE_COUNT,
      activeSearch
    ),
    enabled: accountReady,
  });
  const menusQuery = useQuery({
    queryKey: ["menus", viewer ?? "pending", "home"],
    queryFn: () => apiJson<{ data: MenuPreview[] }>(ApiRoutes.menu.all),
    enabled: accountReady,
    staleTime: Infinity,
  });

  return (
    <div className='relative -m-5 flex flex-col'>
      <HomeHero />
      <div className='flex flex-col gap-8 px-5 py-6 sm:px-7'>
        <div className='flex flex-col gap-4'>
          <RecipeSearchField
            value={draft}
            onChange={setDraft}
            placeholder={t("homePage.searchPlaceholder")}
            containerClassName='w-full max-w-none bg-card md:w-full'
          />
          <DishCategoryChips
            categories={categories}
            value={categoryId}
            onChange={(category) => commit({ q: search, category })}
          />
        </div>

        {isSearching ? (
          <RecipeSection
            title={t("homePage.results")}
            viewAll={t("homePage.viewAll")}
            search={{ q: activeSearch, category: categoryId }}
            dishes={resultsQuery.data?.data}
            pending={resultsQuery.isPending}
            empty={t("homePage.emptyRecipes")}
          />
        ) : (
          <>
            <RecipeSection
              title={t("homePage.popular")}
              viewAll={t("homePage.viewAll")}
              dishes={popularQuery.data?.data}
              pending={popularQuery.isPending}
              empty={t("homePage.emptyRecipes")}
            />
            <RecipeSection
              title={t("homePage.recent")}
              viewAll={t("homePage.viewAll")}
              dishes={recentQuery.data?.data}
              pending={recentQuery.isPending}
              empty={t("homePage.emptyRecipes")}
            />
          </>
        )}

        {accountReady ? (
          <div className='grid gap-8 lg:grid-cols-2'>
            <MineSection
              title={t("homePage.myCookbook")}
              to={Routes.RECIPES}
              seeAll={t("homePage.seeAll")}
              search={{
                q: activeSearch || undefined,
                category: categoryId,
                scope: DishListScope.CREATED_BY_ME,
              }}
              empty={t("homePage.emptyMine")}
              pending={mineQuery.isPending}
              dishes={mineQuery.data?.data ?? []}
            />
            <MenuSection
              title={t("homePage.myMenus")}
              seeAll={t("homePage.seeAll")}
              empty={t("homePage.emptyMenus")}
              pending={menusQuery.isPending}
              menus={(menusQuery.data?.data ?? []).slice(0, MINE_COUNT)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const SectionHeading = ({
  title,
  to,
  action,
  search,
}: {
  title: string;
  to: typeof Routes.RECIPES | typeof Routes.MENUS;
  action: string;
  search?: { q?: string; category?: string; scope?: DishListScope };
}) => {
  return (
    <div className='mb-3 flex items-baseline justify-between gap-3'>
      <h2 className='font-serif text-[26px] leading-8 font-normal text-foreground'>
        {title}
      </h2>
      <Link
        to={to}
        search={search}
        className='inline-flex items-center gap-1 text-[13px] font-medium text-brand'
      >
        {action}
        <ArrowRight className='size-3.5' strokeWidth={1.5} />
      </Link>
    </div>
  );
};

const RecipeSection = ({
  title,
  viewAll,
  search,
  dishes,
  pending,
  empty,
}: {
  title: string;
  viewAll: string;
  search?: { q?: string; category?: string };
  dishes?: DishListResult["data"];
  pending: boolean;
  empty: string;
}) => {
  return (
    <section>
      <SectionHeading
        title={title}
        to={Routes.RECIPES}
        action={viewAll}
        search={search}
      />
      {pending ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: PREVIEW_COUNT }, (_, index) => (
            <div
              key={index}
              className='h-72 animate-pulse rounded-2xl border border-border bg-card'
            />
          ))}
        </div>
      ) : null}
      {dishes && dishes.length === 0 ? (
        <p className='text-[13px] text-muted-foreground'>{empty}</p>
      ) : null}
      {dishes && dishes.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {dishes.map((dish) => (
            <HomeRecipeCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

const MineSection = ({
  title,
  to,
  seeAll,
  search,
  empty,
  pending,
  dishes,
}: {
  title: string;
  to: typeof Routes.RECIPES;
  seeAll: string;
  search?: { q?: string; category?: string; scope?: DishListScope };
  empty: string;
  pending: boolean;
  dishes: DishListCard[];
}) => {
  const { t } = useTranslation();

  return (
    <section>
      <SectionHeading title={title} to={to} action={seeAll} search={search} />
      {pending ? (
        <div className='h-28 animate-pulse rounded-2xl bg-card' />
      ) : null}
      {!pending && dishes.length === 0 ? (
        <p className='text-[13px] text-muted-foreground'>{empty}</p>
      ) : null}
      {dishes.length > 0 ? (
        <div className='flex flex-col gap-2.5'>
          {dishes.map((dish) => {
            const cover = [...(dish.photos ?? [])].sort(
              (a, b) => a.order - b.order
            )[0];
            return (
              <Link
                key={dish.id}
                to={Routes.RECIPE}
                params={{ recipeId: dish.id }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5",
                  recipeCardInteractiveClass
                )}
              >
                <div className='size-14 shrink-0 overflow-hidden rounded-lg bg-background'>
                  <RecipeImage
                    src={cover?.url}
                    className='size-full object-cover'
                  />
                </div>
                <div className='min-w-0'>
                  <p className='truncate font-serif text-[16px] leading-5 font-semibold'>
                    {dish.title}
                  </p>
                  <p className='mt-0.5 truncate text-[12px] text-muted-foreground'>
                    {[
                      dish.cookTime ? formatMinutes(dish.cookTime, t) : "",
                      t(`recipe.create.${dish.difficulty.toLowerCase()}`),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

const MenuSection = ({
  title,
  seeAll,
  empty,
  pending,
  menus,
}: {
  title: string;
  seeAll: string;
  empty: string;
  pending: boolean;
  menus: MenuPreview[];
}) => {
  const { t } = useTranslation();

  return (
    <section>
      <SectionHeading title={title} to={Routes.MENUS} action={seeAll} />
      {pending ? (
        <div className='h-28 animate-pulse rounded-2xl bg-card' />
      ) : null}
      {!pending && menus.length === 0 ? (
        <p className='text-[13px] text-muted-foreground'>{empty}</p>
      ) : null}
      {menus.length > 0 ? (
        <div className='flex flex-col gap-2.5'>
          {menus.map((menu) => (
            <Link
              key={menu.id}
              to={Routes.MENU}
              params={{ menuId: menu.id }}
              className='flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5'
            >
              <div className='grid size-14 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-lg bg-background'>
                {menu.dishCoverPhotoUrls.slice(0, 4).map((photoUrl) => (
                  <RecipeImage
                    key={photoUrl}
                    src={photoUrl}
                    className='size-full object-cover'
                  />
                ))}
              </div>
              <div className='min-w-0'>
                <p className='truncate font-serif text-[16px] leading-5 font-semibold'>
                  {menu.name}
                </p>
                <p className='mt-0.5 text-[12px] text-muted-foreground'>
                  {t("homePage.recipes", { count: menu.dishesCount })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};
