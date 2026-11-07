import { Link } from '@tanstack/react-router'
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
    <Link
      to={Routes.MENU}
      params={{ menuId: menu.id }}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card text-foreground',
        recipeCardInteractiveClass,
      )}
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
      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
        <h2 className="truncate font-serif text-[16px] leading-6 font-normal italic">
          {menu.name}
        </h2>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] leading-4 text-subtle">
          <span>{t('homePage.recipes', { count: menu.dishesCount })}</span>
          {menu.occasion ? <span className="truncate">{menu.occasion}</span> : null}
        </div>
      </div>
    </Link>
  )
}
