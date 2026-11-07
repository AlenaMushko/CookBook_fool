import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Check, MoreHorizontal, Pencil, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageTitle } from '@components/common'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Routes } from '@constants/routes'
import {
  MENU_DESCRIPTION_MAX,
  MENU_NAME_MAX,
  MENU_OCCASION_MAX,
} from '@/features/menus/schemas/menu.schema'

export const MenuDetailHeader = ({
  name,
  description,
  occasion,
  recipeCount,
  updated,
  nameError,
  editingName,
  editingDescription,
  dirty,
  saving,
  onNameChange,
  onDescriptionChange,
  onOccasionChange,
  onEditName,
  onEditDescription,
  onFinishName,
  onFinishDescription,
  onSave,
  onAskDelete,
}: {
  name: string
  description: string
  occasion: string
  recipeCount: number
  updated: string
  nameError?: string
  editingName: boolean
  editingDescription: boolean
  dirty: boolean
  saving: boolean
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onOccasionChange: (value: string) => void
  onEditName: () => void
  onEditDescription: () => void
  onFinishName: () => void
  onFinishDescription: () => void
  onSave: () => void
  onAskDelete: () => void
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Link
        to={Routes.MENUS}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        {t('menus.title')}
      </Link>

      <header className="mt-4 flex flex-col gap-4 min-[770px]:flex-row min-[770px]:items-start min-[770px]:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <PageTitle
              hidden={editingName}
              className="truncate font-serif text-[32px] leading-tight text-foreground"
            >
              {name.trim() || t('menus.createPage.namePlaceholder')}
            </PageTitle>
            {editingName ? (
              <input
                autoFocus
                value={name}
                maxLength={MENU_NAME_MAX}
                aria-label={t('menus.detail.editName')}
                className="w-full cursor-text bg-transparent font-serif text-[32px] leading-tight text-foreground outline-none"
                onChange={(event) => onNameChange(event.target.value)}
                onBlur={onFinishName}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onFinishName()
                }}
              />
            ) : null}
            <button
              type="button"
              className="cursor-pointer text-subtle transition-colors duration-200 hover:text-foreground"
              aria-label={t('menus.detail.editName')}
              onClick={onEditName}
            >
              <Pencil className="size-4" strokeWidth={1.5} />
            </button>
          </div>
          {nameError ? <p className="mt-1 text-[13px] text-destructive">{nameError}</p> : null}
          <div className="mt-1 flex items-start gap-2">
            {editingDescription ? (
              <textarea
                autoFocus
                value={description}
                maxLength={MENU_DESCRIPTION_MAX}
                rows={2}
                aria-label={t('menus.detail.editDescription')}
                className="w-full cursor-text resize-none bg-transparent text-[14px] leading-5 text-muted-foreground outline-none"
                onChange={(event) => onDescriptionChange(event.target.value)}
                onBlur={onFinishDescription}
              />
            ) : (
              <p className="text-[14px] leading-5 text-muted-foreground">
                {description || t('menus.createPage.descriptionPlaceholder')}
              </p>
            )}
            <button
              type="button"
              className="mt-0.5 cursor-pointer text-subtle transition-colors duration-200 hover:text-foreground"
              aria-label={t('menus.detail.editDescription')}
              onClick={onEditDescription}
            >
              <Pencil className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-subtle">
            <label className="inline-flex cursor-text items-center gap-1.5">
              <Calendar className="size-3.5" strokeWidth={1.5} />
              <input
                value={occasion}
                maxLength={MENU_OCCASION_MAX}
                placeholder={t('menus.createPage.occasionPlaceholder')}
                aria-label={t('menus.createPage.occasion')}
                className="w-40 cursor-text bg-transparent text-foreground outline-none placeholder:text-subtle"
                onChange={(event) => onOccasionChange(event.target.value)}
              />
            </label>
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="size-3.5" strokeWidth={1.5} />
              {t('cookbook.count', { count: recipeCount })}
            </span>
            <span>{t('menus.detail.updated', { date: updated })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" aria-label={t('menus.detail.more')} />}
            >
              <MoreHorizontal className="size-4" strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={onAskDelete}>
                {t('menus.detail.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" className="cursor-pointer" disabled={!dirty || saving} isLoading={saving} onClick={onSave}>
            <Check className="size-3.5" strokeWidth={1.5} />
            {t('menus.detail.save')}
          </Button>
        </div>
      </header>
    </>
  )
}
