import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'

import { stageDragId } from '../../lib/menu-drag'
import type { MenuDishDraft, MenuStageDraft } from '../../types/menu.types'
import { MenuStageCard } from './MenuStageCard'

const dishesIn = (dishes: MenuDishDraft[], sectionId: string | null) =>
  dishes.filter((dish) => dish.sectionId === sectionId)

export const MenuStageList = ({
  sections,
  dishes,
  selectedSectionId,
  onSelectSection,
  onRenameSection,
  onRemoveSection,
  onRemoveDish,
  onAddSection,
}: {
  sections: MenuStageDraft[]
  dishes: MenuDishDraft[]
  selectedSectionId: string | null
  onSelectSection: (sectionId: string | null) => void
  onRenameSection: (sectionId: string, name: string) => void
  onRemoveSection: (sectionId: string) => void
  onRemoveDish: (dishId: string) => void
  onAddSection: () => string
}) => {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const loose = dishesIn(dishes, null)

  return (
    <div className="flex flex-col gap-3">
      <SortableContext
        items={sections.map((section) => stageDragId(section.id))}
        strategy={verticalListSortingStrategy}
      >
        {loose.length > 0 ? (
          <MenuStageCard
            id={null}
            name={t('menus.detail.unsectioned')}
            dishes={loose}
            selected={selectedSectionId == null}
            collapsed={false}
            editing={false}
            onSelect={() => onSelectSection(null)}
            onToggle={() => undefined}
            onEdit={() => undefined}
            onRename={() => undefined}
            onRemove={() => undefined}
            onRemoveDish={onRemoveDish}
          />
        ) : null}
        {sections.map((section) => (
          <MenuStageCard
            key={section.id}
            id={section.id}
            name={section.name}
            dishes={dishesIn(dishes, section.id)}
            selected={selectedSectionId === section.id}
            collapsed={collapsed[section.id] ?? false}
            editing={editingId === section.id}
            onSelect={() => onSelectSection(section.id)}
            onToggle={() =>
              setCollapsed((current) => ({ ...current, [section.id]: !current[section.id] }))
            }
            onEdit={() => setEditingId(section.id)}
            onRename={(name) => {
              onRenameSection(section.id, name)
              setEditingId(null)
            }}
            onRemove={() => onRemoveSection(section.id)}
            onRemoveDish={onRemoveDish}
          />
        ))}
      </SortableContext>
      <Button
        type="button"
        variant="secondary"
        className="mt-1 h-11 w-fit cursor-pointer px-4"
        onClick={() => setEditingId(onAddSection())}
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
        {t('menus.detail.addStage')}
      </Button>
    </div>
  )
}
