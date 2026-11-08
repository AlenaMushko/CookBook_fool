import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Check, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiError } from '@api/client'
import { ConfirmationDialog } from '@components/common/ConfirmationDialog'
import { Button } from '@components/ui/button'
import { Sheet, SheetContent } from '@components/ui/sheet'
import { Routes } from '@constants/routes'
import { forgetShoppingList, menuQueryKeys, menusApi } from '@/features/menus'
import { useIsDesktop } from '@/features/menus/hooks/useIsDesktop'
import { placeDish, placementFromDish, toBoardDraft } from '@/features/menus/lib/menu-board'
import type { MenuBoardDraft, MenuDetail } from '@/features/menus/types/menu.types'
import type { DishListCard } from '@/features/recipes/types/recipe.types'
import { showToast } from '@/lib/toast'

import { AddRecipesPanel } from './AddRecipesPanel'
import { MenuBoardDnd } from './MenuBoardDnd'
import { MenuDetailHeader } from './MenuDetailHeader'
import { MenuDetailHint } from './MenuDetailHint'
import { MenuStageList } from './MenuStageList'

export const MenuEditor = ({ menu }: { menu: MenuDetail }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isDesktop = useIsDesktop()
  const [saved, setSaved] = useState(menu)
  const [draft, setDraft] = useState<MenuBoardDraft>(() => toBoardDraft(menu))
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(menu.sections[0]?.id ?? null)
  const [hintOpen, setHintOpen] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [nameError, setNameError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const placedIds = useMemo(() => new Set(draft.dishes.map((dish) => dish.dishId)), [draft.dishes])
  const dirty = JSON.stringify(draft) !== JSON.stringify(toBoardDraft(saved))
  const target =
    draft.sections.find((section) => section.id === selectedSectionId) ??
    (selectedSectionId == null
      ? { id: null, name: t('menus.detail.unsectioned') }
      : draft.sections[0])
  const updated = new Date(saved.updated).toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const addDish = (dish: DishListCard, sectionId: string | null, beforeDishId?: string) => {
    setDraft((current) => ({
      ...current,
      dishes: placeDish(current.dishes, placementFromDish(dish, sectionId), beforeDishId),
    }))
    setSelectedSectionId(sectionId)
  }

  const removeDish = (dishId: string) => {
    setDraft((current) => ({
      ...current,
      dishes: current.dishes.filter((dish) => dish.dishId !== dishId),
    }))
  }

  const save = async () => {
    const name = draft.name.trim()
    if (!name) {
      setNameError(t('menus.detail.nameRequired'))
      return
    }
    if (draft.sections.some((section) => !section.name.trim())) {
      showToast(t('menus.detail.stageNameRequired'), 'warning')
      return
    }
    const names = draft.sections.map((section) => section.name.trim().toLowerCase())
    if (new Set(names).size !== names.length) {
      showToast(t('menus.detail.duplicateStage'), 'warning')
      return
    }

    setSaving(true)
    setNameError(undefined)
    try {
      const next = await menusApi.saveBoard(menu.id, saved, {
        ...draft,
        name,
        description: draft.description.trim(),
        occasion: draft.occasion.trim(),
      })
      setSaved(next)
      setDraft(toBoardDraft(next))
      setSelectedSectionId(next.sections[0]?.id ?? null)
      queryClient.setQueryData(menuQueryKeys.detail(menu.id), next)
      forgetShoppingList(queryClient, menu.id)
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() })
      showToast(t('menus.detail.saved'), 'success')
      await navigate({ to: Routes.MENU, params: { menuId: menu.id } })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'MENU_NAME_EXISTS') {
        setNameError(t('menus.detail.nameTaken'))
        showToast(t('menus.detail.nameTaken'), 'error')
        return
      }
      showToast(t('menus.detail.saveFailed'), 'error')
      const next = await menusApi.getById(menu.id).catch(() => null)
      if (next) {
        setSaved(next)
        setDraft(toBoardDraft(next))
        queryClient.setQueryData(menuQueryKeys.detail(menu.id), next)
      }
    } finally {
      setSaving(false)
    }
  }

  const removeMenu = async () => {
    setDeleting(true)
    try {
      await menusApi.delete(menu.id)
      forgetShoppingList(queryClient, menu.id)
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() })
      showToast(t('menus.detail.deleted'), 'success')
      await navigate({ to: Routes.MENUS })
    } catch {
      showToast(t('menus.detail.saveFailed'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const panel = (
    <AddRecipesPanel
      placedIds={placedIds}
      targetName={target?.name || t('menus.detail.unsectioned')}
      sections={draft.sections}
      draggable={isDesktop}
      chooseStage={!isDesktop}
      onAdd={(dish, sectionId) =>
        addDish(dish, sectionId === undefined ? (target?.id ?? null) : sectionId)
      }
      onRemove={removeDish}
    />
  )

  return (
    <MenuBoardDnd draft={draft} setDraft={setDraft} onPickPlaced={setSelectedSectionId}>
    <div className="-m-5 flex min-h-full flex-col px-5 pt-5 pb-20 sm:px-8 md:pb-8">
      <MenuDetailHeader
        menuId={menu.id}
        name={draft.name}
        description={draft.description}
        occasion={draft.occasion}
        recipeCount={draft.dishes.length}
        updated={updated}
        nameError={nameError}
        editingName={editingName}
        editingDescription={editingDescription}
        dirty={dirty}
        saving={saving}
        onNameChange={(value) => {
          setDraft((current) => ({ ...current, name: value }))
          setNameError(undefined)
        }}
        onDescriptionChange={(value) =>
          setDraft((current) => ({ ...current, description: value }))
        }
        onOccasionChange={(value) => setDraft((current) => ({ ...current, occasion: value }))}
        onEditName={() => setEditingName(true)}
        onEditDescription={() => setEditingDescription(true)}
        onFinishName={() => setEditingName(false)}
        onFinishDescription={() => setEditingDescription(false)}
        onSave={save}
        onAskDelete={() => setDeleteOpen(true)}
      />
      {hintOpen ? <MenuDetailHint onClose={() => setHintOpen(false)} /> : null}
      <div className="mt-5 grid items-start gap-5 min-[770px]:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_340px]">
        <MenuStageList
          sections={draft.sections}
          dishes={draft.dishes}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
          onRenameSection={(sectionId, name) =>
            setDraft((current) => ({
              ...current,
              sections: current.sections.map((section) =>
                section.id === sectionId ? { ...section, name } : section,
              ),
            }))
          }
          onRemoveSection={(sectionId) => {
            setDraft((current) => ({
              ...current,
              sections: current.sections.filter((section) => section.id !== sectionId),
              dishes: current.dishes.map((dish) =>
                dish.sectionId === sectionId ? { ...dish, sectionId: null } : dish,
              ),
            }))
            setSelectedSectionId((current) => (current === sectionId ? null : current))
          }}
          onRemoveDish={removeDish}
          onAddSection={() => {
            const id = `tmp:${crypto.randomUUID()}`
            setDraft((current) => ({
              ...current,
              sections: [...current.sections, { id, name: '' }],
            }))
            setSelectedSectionId(id)
            return id
          }}
        />
        {isDesktop ? <div>{panel}</div> : null}
      </div>

      {isDesktop ? null : (
        <div className="mt-5 flex w-full flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full cursor-pointer"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
            {t('menus.detail.addRecipes')}
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer"
            disabled={!dirty || saving}
            isLoading={saving}
            onClick={() => void save()}
          >
            <Check className="size-3.5" strokeWidth={1.5} />
            {t('save')}
          </Button>
        </div>
      )}

      {isDesktop ? null : (
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <div className="p-4">{panel}</div>
          </SheetContent>
        </Sheet>
      )}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('menus.detail.deleteTitle')}
        confirmLabel={t('menus.detail.delete')}
        cancelLabel={t('menus.createPage.clearConfirmNo')}
        isSubmitting={deleting}
        onConfirm={removeMenu}
      >
        {t('menus.detail.deleteBody')}
      </ConfirmationDialog>
    </div>
    </MenuBoardDnd>
  )
}
