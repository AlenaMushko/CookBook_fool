import { useDndContext, useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { dishDragId, readDragData, stageBodyId, stageDragId } from '../../lib/menu-drag'
import type { MenuDishDraft } from '../../types/menu.types'
import { MenuDragHandle } from './MenuBoardDnd'
import { MenuDishRow } from './MenuDishRow'
import { MenuIconButton } from './MenuIconButton'

export const MenuStageCard = ({
  id,
  name,
  dishes,
  selected,
  collapsed,
  editing,
  onSelect,
  onToggle,
  onEdit,
  onRename,
  onRemove,
  onRemoveDish,
}: {
  id: string | null
  name: string
  dishes: MenuDishDraft[]
  selected: boolean
  collapsed: boolean
  editing: boolean
  onSelect: () => void
  onToggle: () => void
  onEdit: () => void
  onRename: (name: string) => void
  onRemove: () => void
  onRemoveDish: (dishId: string) => void
}) => {
  const { t } = useTranslation()
  const { active, over } = useDndContext()
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({
    id: id ? stageDragId(id) : 'stage:loose',
    data: id ? { kind: 'stage', stageId: id } : { kind: 'stage-body', stageId: null },
    disabled: id == null,
  })
  const { setNodeRef: setBodyRef } = useDroppable({
    id: stageBodyId(id),
    data: { kind: 'stage-body', stageId: id },
  })
  const activeData = readDragData(active?.data.current)
  const overData = readDragData(over?.data.current)
  const overThis =
    (overData?.kind === 'stage' && overData.stageId === id) ||
    (overData?.kind === 'stage-body' && overData.stageId === id)
  const dropTarget =
    (activeData?.kind === 'stage' && overData?.kind === 'stage' && overData.stageId === id && activeData.stageId !== id) ||
    ((activeData?.kind === 'dish' || activeData?.kind === 'pick') && overThis)

  return (
    <section
      ref={setNodeRef}
      style={{
        transform:
          activeData?.kind === 'stage' && !isDragging ? CSS.Transform.toString(transform) : undefined,
        transition: activeData?.kind === 'stage' && !isDragging ? transition : undefined,
      }}
      className={cn(
        'cursor-pointer rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300 ease-smooth hover:border-primary/40 hover:shadow-[0_8px_18px_rgba(43,38,32,0.12)]',
        selected || dropTarget ? 'border-primary' : 'border-border',
        isDragging && 'opacity-45',
      )}
      onClick={onSelect}
    >
      <header className="flex items-center gap-2 px-3 py-3">
        <MenuDragHandle
          label={t('menus.detail.drag')}
          disabled={id == null}
          hidden={id == null}
          attributes={attributes}
          listeners={listeners}
        />
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              defaultValue={name}
              placeholder={t('menus.detail.stagePlaceholder')}
              aria-label={t('menus.detail.renameStage')}
              className="w-full cursor-text bg-transparent font-serif text-[18px] text-foreground outline-none"
              onClick={(event) => event.stopPropagation()}
              onBlur={(event) => onRename(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
            />
          ) : (
            <button
              type="button"
              className="cursor-pointer truncate text-left font-serif text-[18px] text-foreground"
              onClick={(event) => {
                event.stopPropagation()
                onSelect()
              }}
            >
              {name || t('menus.detail.stagePlaceholder')}
            </button>
          )}
          <p className="text-[12px] text-subtle">{t('cookbook.count', { count: dishes.length })}</p>
        </div>
        {id != null ? (
          <>
            <MenuIconButton label={t('menus.detail.renameStage')} onClick={onEdit}>
              <Pencil className="size-3.5" strokeWidth={1.5} />
            </MenuIconButton>
            <MenuIconButton label={t('menus.detail.removeStage')} onClick={onRemove}>
              <Trash2 className="size-3.5" strokeWidth={1.5} />
            </MenuIconButton>
            <MenuIconButton
              label={t(collapsed ? 'menus.detail.expand' : 'menus.detail.collapse')}
              onClick={onToggle}
            >
              <ChevronDown
                className={cn('size-4 transition-transform duration-300 ease-smooth', collapsed && '-rotate-90')}
                strokeWidth={1.5}
              />
            </MenuIconButton>
          </>
        ) : null}
      </header>

      {collapsed ? null : (
        <div ref={setBodyRef} className="flex flex-col gap-2 px-3 pb-3">
          <SortableContext
            items={dishes.map((dish) => dishDragId(dish.dishId))}
            strategy={verticalListSortingStrategy}
          >
            {dishes.map((dish) => (
              <MenuDishRow key={dish.dishId} dish={dish} onRemove={() => onRemoveDish(dish.dishId)} />
            ))}
          </SortableContext>
          {dishes.length === 0 ? (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center',
                dropTarget ? 'border-primary bg-primary/5' : 'border-border bg-background',
              )}
            >
              <p className="text-[13px] text-muted-foreground">{t('menus.detail.dropHere')}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-subtle">
                <Plus className="size-3.5" strokeWidth={1.5} />
                {t('menus.detail.addToStage')}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
