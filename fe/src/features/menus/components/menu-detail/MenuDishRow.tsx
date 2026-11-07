import { useDndContext } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { recipeCardInteractiveClass } from '@/features/recipes/lib/recipe-card'
import { cn } from '@/lib/utils'

import { dishDragId, readDragData } from '../../lib/menu-drag'
import type { MenuDishDraft } from '../../types/menu.types'
import { MenuDragHandle } from './MenuBoardDnd'
import { MenuDishLink } from './MenuDishLink'
import { MenuIconButton } from './MenuIconButton'

export const MenuDishRow = ({ dish, onRemove }: { dish: MenuDishDraft; onRemove: () => void }) => {
  const { t } = useTranslation()
  const { over, active } = useDndContext()
  const { setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: dishDragId(dish.dishId),
    data: { kind: 'dish', dishId: dish.dishId, sectionId: dish.sectionId },
  })
  const overData = readDragData(over?.data.current)
  const highlighted =
    overData?.kind === 'dish' &&
    overData.dishId === dish.dishId &&
    active?.id !== dishDragId(dish.dishId) &&
    readDragData(active?.data.current)?.kind !== 'stage'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex touch-none items-center gap-2 rounded-xl border bg-background px-2 py-2',
        recipeCardInteractiveClass,
        'cursor-grab active:cursor-grabbing',
        highlighted ? 'border-primary' : 'border-border',
        isDragging && 'opacity-45',
      )}
      {...listeners}
      onDragStart={(event) => event.preventDefault()}
    >
      <MenuDragHandle
        label={t('menus.detail.drag')}
        attributes={attributes}
        listeners={listeners}
      />
      <MenuDishLink dish={dish} onClick={(event) => event.stopPropagation()} />
      <MenuIconButton label={t('menus.detail.removeRecipe')} onClick={onRemove}>
        <X className="size-3.5" strokeWidth={1.5} />
      </MenuIconButton>
    </div>
  )
}
