import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useForm, type FieldPath } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ApiError } from '@api/client'
import { queryClient } from '@api/queryClient'
import { ConfirmationDialog } from '@components/common/ConfirmationDialog'
import { Field, FieldError, FieldLabel } from '@components/ui/field'
import { FormFieldInput } from '@components/ui/form-field-input'
import { Textarea } from '@components/ui/textarea'
import { Routes } from '@constants/routes'
import type { DishListCard } from '@/features/recipes/types/recipe.types'
import { useAutosaveDraft } from '@/hooks/useAutosaveDraft'
import { showToast } from '@/lib/toast'

import { menusApi } from '../api/menus.api'
import { menuQueryKeys } from '../api/menus.queries'
import {
  MENU_DRAFT_AUTOSAVE_MS,
  clearMenuDraft,
  draftToDish,
  dishToDraft,
  readMenuDraft,
  saveMenuDraft,
} from '../lib/menu-draft'
import {
  createMenuSchema,
  MENU_DESCRIPTION_MAX,
  MENU_NAME_MAX,
  MENU_OCCASION_MAX,
  type CreateMenuValues,
} from '../schemas/menu.schema'
import { MenuDishPicker } from './MenuDishPicker'
import { MenuDraft } from './MenuDraft'

const labelClass = 'text-[13px] font-medium tracking-normal text-foreground normal-case'

const emptyForm = (): CreateMenuValues => ({
  name: '',
  description: '',
  occasion: '',
})

const isMenuStarted = (values: CreateMenuValues, dishes: DishListCard[]) =>
  Boolean(
    values.name.trim() ||
      values.description.trim() ||
      values.occasion.trim() ||
      dishes.length,
  )

export const CreateMenuForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [savedDraft] = useState(() => readMenuDraft())
  const [dishes, setDishes] = useState<DishListCard[]>(() =>
    savedDraft ? savedDraft.dishes.map(draftToDish) : [],
  )
  const [clearOpen, setClearOpen] = useState(false)
  const [draftOpen, setDraftOpen] = useState(savedDraft !== null)

  const schema = useMemo(() => createMenuSchema(t), [t])
  const draftSchema = useMemo(() => createMenuSchema(t, 'draft'), [t])
  const form = useForm<CreateMenuValues>({
    resolver: zodResolver(schema),
    defaultValues: savedDraft
      ? {
          name: savedDraft.name,
          description: savedDraft.description,
          occasion: savedDraft.occasion,
        }
      : emptyForm(),
  })
  const { getValues, reset, clearErrors, setError, watch, register, handleSubmit, formState } =
    form
  const name = watch('name')
  const occasion = watch('occasion')
  const selectedIds = useMemo(() => new Set(dishes.map((dish) => dish.id)), [dishes])

  const draftAutosave = useAutosaveDraft({
    intervalMs: MENU_DRAFT_AUTOSAVE_MS,
    save: () => {
      const values = getValues()
      if (!isMenuStarted(values, dishes)) return
      saveMenuDraft({ ...values, dishes: dishes.map(dishToDraft) })
    },
  })

  const resetForm = () => {
    draftAutosave.pause()
    clearMenuDraft()
    reset(emptyForm())
    setDishes([])
    draftAutosave.resume()
  }

  const requestClear = () => {
    if (!isMenuStarted(getValues(), dishes)) {
      resetForm()
      return
    }
    setClearOpen(true)
  }

  const handleSaveDraft = () => {
    const values = getValues()
    const parsed = draftSchema.safeParse(values)
    if (!parsed.success) {
      clearErrors()
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.')
        if (!path) continue
        setError(path as FieldPath<CreateMenuValues>, { message: issue.message })
      }
      return
    }

    clearErrors()
    try {
      saveMenuDraft({ ...parsed.data, dishes: dishes.map(dishToDraft) })
      draftAutosave.pause()
      showToast(t('menus.createPage.draftSaved'), 'success')
      void navigate({ to: Routes.MENUS })
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('error.serverError'), 'error')
    }
  }

  const createMenu = useMutation({
    mutationFn: async (values: CreateMenuValues) => {
      const menu = await menusApi.create({
        name: values.name,
        description: values.description || undefined,
        occasion: values.occasion || undefined,
      })
      if (dishes.length === 0) return true
      try {
        await menusApi.addDishes(
          menu.id,
          dishes.map((dish) => dish.id),
        )
        return true
      } catch {
        return false
      }
    },
    onSuccess: async (dishesAdded) => {
      draftAutosave.pause()
      clearMenuDraft()
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() })
      showToast(
        t(dishesAdded ? 'menus.createPage.created' : 'menus.createPage.dishesFailed'),
        dishesAdded ? 'success' : 'error',
      )
      void navigate({ to: Routes.MENUS })
    },
    onError: (error) => {
      const taken = error instanceof ApiError && error.code === 'MENU_NAME_EXISTS'
      const message = taken
        ? t('menus.createPage.nameTaken')
        : error instanceof Error
          ? error.message
          : t('error.serverError')
      if (taken) setError('name', { message })
      showToast(message, 'error')
    },
  })

  const toggleDish = (dish: DishListCard) => {
    setDishes((current) =>
      current.some((item) => item.id === dish.id)
        ? current.filter((item) => item.id !== dish.id)
        : [...current, dish],
    )
  }

  return (
    <>
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={handleSubmit((values) => createMenu.mutate(values))}
        noValidate
      >
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 lg:grid-cols-3">
          <FormFieldInput
            label={t('menus.createPage.name')}
            labelClassName={labelClass}
            required
            maxLength={MENU_NAME_MAX}
            placeholder={t('menus.createPage.namePlaceholder')}
            error={formState.errors.name?.message}
            {...register('name')}
          />
          <Field data-invalid={Boolean(formState.errors.description)}>
            <FieldLabel htmlFor="menu-description" className={labelClass}>
              {t('menus.createPage.description')}
            </FieldLabel>
            <Textarea
              id="menu-description"
              rows={2}
              maxLength={MENU_DESCRIPTION_MAX}
              placeholder={t('menus.createPage.descriptionPlaceholder')}
              aria-invalid={Boolean(formState.errors.description)}
              className="min-h-[72px] md:min-h-[72px]"
              {...register('description')}
            />
            <FieldError>{formState.errors.description?.message}</FieldError>
          </Field>
          <FormFieldInput
            label={t('menus.createPage.occasion')}
            labelClassName={labelClass}
            maxLength={MENU_OCCASION_MAX}
            placeholder={t('menus.createPage.occasionPlaceholder')}
            error={formState.errors.occasion?.message}
            footer={
              <p
                className="mt-2.5 text-right font-sans text-counter font-normal text-subtle"
                aria-live="polite"
              >
                {occasion.length} / {MENU_OCCASION_MAX}
              </p>
            }
            {...register('occasion')}
          />
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <MenuDishPicker selectedIds={selectedIds} onToggle={toggleDish} />
          <MenuDraft
            dishes={dishes}
            pending={createMenu.isPending}
            canSubmit={name.trim().length > 0}
            onRemove={(dishId) =>
              setDishes((current) => current.filter((dish) => dish.id !== dishId))
            }
            onClear={requestClear}
            onSaveDraft={handleSaveDraft}
          />
        </div>
      </form>
      <ConfirmationDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title={t('menus.createPage.clearConfirmTitle')}
        cancelLabel={t('menus.createPage.clearConfirmNo')}
        confirmLabel={t('menus.createPage.clearConfirmYes')}
        onConfirm={() => {
          setClearOpen(false)
          resetForm()
        }}
      >
        {t('menus.createPage.clearConfirmDescription')}
      </ConfirmationDialog>
      <ConfirmationDialog
        open={draftOpen}
        onOpenChange={setDraftOpen}
        title={t('menus.createPage.draftResumeTitle')}
        cancelLabel={t('menus.createPage.draftResumeContinue')}
        cancelVariant="primary"
        confirmLabel={t('menus.createPage.draftResumeClear')}
        confirmVariant="secondary"
        onConfirm={() => {
          setDraftOpen(false)
          resetForm()
        }}
      >
        {t('menus.createPage.draftResumeDescription')}
      </ConfirmationDialog>
    </>
  )
}
