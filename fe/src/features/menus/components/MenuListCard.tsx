import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Routes } from '@constants/routes'
import { RecipeImage } from '@/features/recipes/components/RecipeImage'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { cn } from '@/lib/utils'

import type { MenuPreview } from '../types/menu.types'

const coverSlots = 4

export const MenuListCard = ({ menu }: { menu: MenuPreview }) => {
  const { t } = useTranslation()
  const covers = Array.from({ length: coverSlots }, (_, index) => menu.dishCoverPhotoUrls[index])

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card text-foreground',
        recipeCardInteractiveClass,
      )}
    >
      <Link
        to={Routes.MENU}
        params={{ menuId: menu.id }}
        className="cursor-pointer"
      >
        <div className="grid h-[171px] grid-cols-2 grid-rows-2 gap-px bg-border">
          {covers.map((photoUrl, index) => (
            <div key={index} className="bg-background">
              {photoUrl ? (
                <RecipeImage src={photoUrl} className="size-full object-cover" />
              ) : null}
            </div>
          ))}
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-3 px-3.5 pt-3 pb-3.5">
          <Link
            to={Routes.MENU}
            params={{ menuId: menu.id }}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <h2 className="truncate font-serif text-[16px] leading-6 font-normal italic">
              {menu.name}
            </h2>
            <div className="mt-2 flex items-center justify-between gap-3 text-[11px] leading-4 text-subtle">
              <span>{t('homePage.recipes', { count: menu.dishesCount })}</span>
              {menu.occasion ? <span className="truncate">{menu.occasion}</span> : null}
            </div>
          </Link>
          <Link
            to={Routes.MENU_SHOPPING}
            params={{ menuId: menu.id }}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-transparent bg-primary/10 px-3.5 py-2 text-[13px] leading-5 font-medium text-primary transition-[background-color,border-color,color] duration-200 ease-smooth hover:border-primary hover:bg-card hover:text-primary"
          >
            <ShoppingCart className="size-4 shrink-0" strokeWidth={1.75} />
            {t('menus.shopping.open')}
          </Link>
        </div>
    </article>
  )
}
