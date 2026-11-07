import { Link } from '@tanstack/react-router'
import type { MouseEvent } from 'react'

import { Routes } from '@constants/routes'
import { RecipeImage } from '@/features/recipes/components/RecipeImage'

import type { MenuDishDraft } from '../../types/menu.types'
import { MenuDishMeta } from './MenuDishMeta'

export const MenuDishLink = ({
  dish,
  onClick,
}: {
  dish: Pick<MenuDishDraft, 'dishId' | 'title' | 'cookTime' | 'baseServings' | 'coverUrl'>
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}) => (
  <Link
    to={Routes.RECIPE}
    params={{ recipeId: dish.dishId }}
    draggable={false}
    className="flex min-w-0 flex-1 items-center gap-3"
    onClick={onClick}
    onDragStart={(event) => event.preventDefault()}
  >
    <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
      <RecipeImage
        src={dish.coverUrl}
        draggable={false}
        className="pointer-events-none size-full object-cover"
      />
    </span>
    <span className="min-w-0">
      <span className="block truncate text-[14px] font-medium text-foreground">{dish.title}</span>
      <MenuDishMeta cookTime={dish.cookTime} baseServings={dish.baseServings} />
    </span>
  </Link>
)
