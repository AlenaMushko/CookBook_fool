import { useDraggable } from '@dnd-kit/core'
import { Check, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RecipeImage } from '@/features/recipes/components/RecipeImage'
import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import type { DishListCard } from '@/features/recipes/types/recipe.types'
import { cn } from '@/lib/utils'

import { coverUrl } from '../../lib/cover-url'
import { pickDragId } from '../../lib/menu-drag'
import { MenuDragHandle } from './MenuBoardDnd'
import { MenuDishMeta } from './MenuDishMeta'

export const RecipePickRow = ({
  dish,
  placed,
  draggable = true,
  onAdd,
  onRemove,
}: {
  dish: DishListCard
  placed: boolean
  draggable?: boolean
  onAdd: () => void
  onRemove: () => void
}) => {
  const { t } = useTranslation()
  const photo = coverUrl(dish)
  const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
    id: pickDragId(dish.id),
    data: { kind: 'pick', dish },
    disabled: placed || !draggable,
  })

  return (
    <li
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-2 rounded-xl border border-border bg-background px-2 py-2',
        draggable && 'touch-none',
        recipeCardInteractiveClass,
        draggable && !placed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        isDragging && 'opacity-45',
      )}
      {...(draggable && !placed ? listeners : {})}
      onDragStart={(event) => event.preventDefault()}
    >
      {draggable ? (
        <MenuDragHandle
          label={t('menus.detail.drag')}
          disabled={placed}
          attributes={attributes}
          listeners={listeners}
        />
      ) : null}
      <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
        <RecipeImage
          src={photo}
          draggable={false}
          className="pointer-events-none size-full object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-foreground">{dish.title}</span>
        <MenuDishMeta cookTime={dish.cookTime} baseServings={dish.baseServings} />
      </span>
      <button
        type="button"
        aria-pressed={placed}
        aria-label={t(placed ? 'menus.createPage.remove' : 'menus.createPage.add')}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={placed ? onRemove : onAdd}
        className={cn(
          'flex size-7 cursor-pointer items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 hover:scale-105',
          placed
            ? 'bg-brand text-white hover:bg-brand/90'
            : 'bg-card text-foreground shadow-[0_1px_2px_rgba(43,38,32,0.16)] hover:bg-primary hover:text-primary-foreground',
        )}
      >
        {placed ? (
          <Check className="size-3.5" strokeWidth={2} />
        ) : (
          <Plus className="size-3.5" strokeWidth={1.5} />
        )}
      </button>
    </li>
  )
}
