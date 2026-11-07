import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { RecipeImage } from '@/features/recipes/components/RecipeImage'
import { cn } from '@/lib/utils'

import { coverUrl } from '../../lib/cover-url'
import { moveStage, placeDish, placementFromDish } from '../../lib/menu-board'
import { mostSpecificDrop, readDragData, type MenuDragData } from '../../lib/menu-drag'
import type { MenuBoardDraft, MenuDishDraft } from '../../types/menu.types'

export const MenuDragHandle = ({
  label,
  disabled,
  hidden,
  attributes,
  listeners,
}: {
  label: string
  disabled?: boolean
  hidden?: boolean
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
}) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    className={cn(
      'touch-none text-subtle hover:text-foreground',
      hidden && 'invisible',
      disabled ? 'cursor-default opacity-40' : 'cursor-grab active:cursor-grabbing',
    )}
    {...attributes}
    {...listeners}
    onPointerDown={(event) => {
      event.stopPropagation()
      listeners?.onPointerDown?.(event)
    }}
  >
    <GripVertical className="size-4" strokeWidth={1.5} />
  </button>
)

const moveDish = (dishes: MenuDishDraft[], from: Extract<MenuDragData, { kind: 'dish' }>, to: MenuDragData) => {
  const moving = dishes.find((dish) => dish.dishId === from.dishId)
  if (!moving || (to.kind !== 'dish' && to.kind !== 'stage-body' && to.kind !== 'stage')) return dishes

  if (to.kind === 'dish' && to.sectionId === from.sectionId) {
    const fromIndex = dishes.findIndex((dish) => dish.dishId === from.dishId)
    const toIndex = dishes.findIndex((dish) => dish.dishId === to.dishId)
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return dishes
    return arrayMove(dishes, fromIndex, toIndex)
  }

  const sectionId = to.kind === 'dish' ? to.sectionId : to.stageId
  const beforeDishId = to.kind === 'dish' ? to.dishId : undefined
  return placeDish(dishes, { ...moving, sectionId }, beforeDishId)
}

const applyDrop = (draft: MenuBoardDraft, from: MenuDragData, to: MenuDragData): MenuBoardDraft => {
  if (from.kind === 'stage' && to.kind === 'stage') {
    return { ...draft, sections: moveStage(draft.sections, from.stageId, to.stageId) }
  }
  if (from.kind === 'dish') {
    return { ...draft, dishes: moveDish(draft.dishes, from, to) }
  }
  if (from.kind !== 'pick' || (to.kind !== 'dish' && to.kind !== 'stage' && to.kind !== 'stage-body')) {
    return draft
  }
  const sectionId = to.kind === 'dish' ? to.sectionId : to.stageId
  const beforeDishId = to.kind === 'dish' ? to.dishId : undefined
  return {
    ...draft,
    dishes: placeDish(draft.dishes, placementFromDish(from.dish, sectionId), beforeDishId),
  }
}

const DragGhost = ({ title, cover }: { title: string; cover?: string | null }) => (
  <div className="flex w-64 items-center gap-3 rounded-xl border border-primary bg-card px-2 py-2 shadow-[0_12px_28px_rgba(43,38,32,0.18)]">
    <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
      <RecipeImage src={cover} className="size-full object-cover" />
    </span>
    <span className="truncate text-[14px] font-medium text-foreground">{title}</span>
  </div>
)

export const MenuBoardDnd = ({
  draft,
  setDraft,
  onPickPlaced,
  children,
}: {
  draft: MenuBoardDraft
  setDraft: Dispatch<SetStateAction<MenuBoardDraft>>
  onPickPlaced: (sectionId: string | null) => void
  children: ReactNode
}) => {
  const { t } = useTranslation()
  const [active, setActive] = useState<MenuDragData | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active: dragged, over }: DragEndEvent) => {
    const from = readDragData(dragged.data.current)
    const to = readDragData(over?.data.current)
    setActive(null)
    if (!from || !to) return
    if (from.kind === 'pick' && (to.kind === 'dish' || to.kind === 'stage' || to.kind === 'stage-body')) {
      onPickPlaced(to.kind === 'dish' ? to.sectionId : to.stageId)
    }
    setDraft((current) => applyDrop(current, from, to))
  }

  const ghost = (() => {
    if (!active) return null
    if (active.kind === 'stage') {
      const stage = draft.sections.find((section) => section.id === active.stageId)
      return (
        <div className="rounded-2xl border border-primary bg-card px-4 py-3 font-serif text-[18px] shadow-[0_12px_28px_rgba(43,38,32,0.18)]">
          {stage?.name || t('menus.detail.stagePlaceholder')}
        </div>
      )
    }
    if (active.kind === 'dish') {
      const dish = draft.dishes.find((item) => item.dishId === active.dishId)
      return <DragGhost title={dish?.title ?? ''} cover={dish?.coverUrl} />
    }
    if (active.kind === 'pick') {
      return <DragGhost title={active.dish.title} cover={coverUrl(active.dish)} />
    }
    return null
  })()

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mostSpecificDrop}
      onDragStart={({ active: dragged }) => setActive(readDragData(dragged.data.current))}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActive(null)}
    >
      {children}
      <DragOverlay zIndex={1400}>{ghost}</DragOverlay>
    </DndContext>
  )
}
