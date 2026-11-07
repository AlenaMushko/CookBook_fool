import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Pencil, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { cn } from '@/lib/utils'

import { toBoardDraft } from '../../lib/menu-board'
import type { MenuDetail, MenuDishDraft } from '../../types/menu.types'
import { MenuDishLink } from './MenuDishLink'

const dishesIn = (dishes: MenuDishDraft[], sectionId: string | null) =>
  dishes.filter((dish) => dish.sectionId === sectionId)

const DishList = ({ dishes }: { dishes: MenuDishDraft[] }) => (
  <div className="flex flex-col gap-2 px-3 pb-3">
    {dishes.map((dish) => (
      <div
        key={dish.dishId}
        className={cn(
          'flex items-center rounded-xl border border-border bg-background px-3 py-2',
          recipeCardInteractiveClass,
        )}
      >
        <MenuDishLink dish={dish} />
      </div>
    ))}
  </div>
)

const StageBlock = ({ name, dishes }: { name: string; dishes: MenuDishDraft[] }) => {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="px-4 py-3">
        <h2 className="font-serif text-[18px] text-foreground">{name}</h2>
        <p className="text-[12px] text-subtle">{t('cookbook.count', { count: dishes.length })}</p>
      </header>
      {dishes.length > 0 ? <DishList dishes={dishes} /> : null}
    </section>
  )
}

export const MenuView = ({ menu }: { menu: MenuDetail }) => {
  const { t, i18n } = useTranslation()
  const board = toBoardDraft(menu)
  const loose = dishesIn(board.dishes, null)
  const updated = new Date(menu.updated).toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="-m-5 flex min-h-full flex-col px-5 pt-5 pb-12 sm:px-8">
      <Link
        to={Routes.MENUS}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        {t('menus.title')}
      </Link>

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-[32px] leading-tight text-foreground">{board.name}</h1>
          {board.description ? (
            <p className="mt-1 text-[14px] leading-5 text-muted-foreground">{board.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-subtle">
            {board.occasion ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" strokeWidth={1.5} />
                {board.occasion}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="size-3.5" strokeWidth={1.5} />
              {t('cookbook.count', { count: board.dishes.length })}
            </span>
            <span>{t('menus.detail.updated', { date: updated })}</span>
          </div>
        </div>
        <Button
          render={<Link to={Routes.MENU_EDIT} params={{ menuId: menu.id }} />}
          className="h-[42px] min-h-0 w-fit shrink-0 px-5 text-[13px]"
        >
          <Pencil className="size-3.5" strokeWidth={1.5} />
          {t('menus.view.edit')}
        </Button>
      </header>

      <p className="mt-5 max-w-2xl text-[14px] leading-5 text-muted-foreground">
        {t('menus.view.stagesNote')}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {loose.length > 0 ? (
          <StageBlock name={t('menus.detail.unsectioned')} dishes={loose} />
        ) : null}
        {board.sections.map((section) => (
          <StageBlock
            key={section.id}
            name={section.name}
            dishes={dishesIn(board.dishes, section.id)}
          />
        ))}
      </div>
    </div>
  )
}
