import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Broom, Globe, Lock, Plus, Save, Send, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type FieldPath,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ApiError } from '@api/client'
import { queryClient } from '@api/queryClient'
import { ConfirmationDialog } from '@components/common/ConfirmationDialog'
import { Button } from '@components/ui/button'
import { Field, FieldError, FieldLabel } from '@components/ui/field'
import { FormFieldInput } from '@components/ui/form-field-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Textarea } from '@components/ui/textarea'
import { DISH_PHOTO_LIMIT, STEP_PHOTO_LIMIT } from '@constants/recipe'
import { Routes } from '@constants/routes'
import { useAutosaveDraft } from '@/hooks/useAutosaveDraft'
import { showToast } from '@/lib/toast'

import { recipesApi } from '../api/recipes.api'
import { recipeQueryKeys } from '../api/recipes.queries'
import { toCreateDishPayload } from '../lib/create-dish-payload'
import { syncUpdatedDish } from '../lib/sync-updated-dish'
import { localizedName, unitSymbol } from '../lib/recipe-locale'
import {
  RECIPE_DRAFT_AUTOSAVE_MS,
  clearRecipeDraft,
  readRecipeDraft,
  saveRecipeDraft,
} from '../lib/recipe-draft'
import { createRecipeSchema } from '../schemas/recipe.schema'
import type {
  CreateRecipeFormValues,
  DishDetails,
  DishDifficulty,
  DishVisibility,
  RecipeIngredientDraft,
} from '../types/recipe.types'
import { IngredientCombobox } from './IngredientCombobox'
import { PrepTimeField } from './PrepTimeField'
import { QuantityField } from './QuantityField'
import { RecipePhotosField } from './RecipePhotosField'
import { SectionCard } from './SectionCard'
import { SegmentedChoice } from './SegmentedChoice'
import { ServingsField } from './ServingsField'

const formLabelClass = 'text-label uppercase tracking-[0.12em]'

const emptyIngredient = (): RecipeIngredientDraft => ({
  ingredient: null,
  unitId: '',
  quantity: '1',
})

const emptyStep = () => ({
  title: '',
  description: '',
  photos: [] as CreateRecipeFormValues['photos'],
})

const emptyForm = (): CreateRecipeFormValues => ({
  title: '',
  description: '',
  cookTime: '',
  servings: '6',
  categoryId: '',
  difficulty: 'EASY',
  visibility: 'PUBLIC',
  photos: [],
  ingredients: [emptyIngredient()],
  steps: [emptyStep()],
})

const photoKeys = (values: CreateRecipeFormValues) => {
  return [
    ...values.photos.map((photo) => photo.key),
    ...values.steps.flatMap((step) => step.photos.map((photo) => photo.key)),
  ]
}

const isRecipeStarted = (values: CreateRecipeFormValues) => {
  if (
    values.title.trim() ||
    values.description.trim() ||
    values.cookTime.trim() ||
    values.servings.trim() !== '6' ||
    values.categoryId ||
    values.difficulty !== 'EASY' ||
    values.visibility !== 'PUBLIC' ||
    values.photos.length > 0 ||
    values.ingredients.length > 1 ||
    values.steps.length > 1
  ) {
    return true
  }

  const ingredient = values.ingredients[0]
  if (
    ingredient?.ingredient ||
    ingredient?.unitId ||
    ingredient?.quantity.trim() !== '1'
  ) {
    return true
  }

  const step = values.steps[0]
  return Boolean(
    step?.title.trim() || step?.description.trim() || step?.photos.length,
  )
}

export const CreateRecipeForm = ({
  mode = 'create',
  recipeId,
  initialValues,
  ingredientGroups = [],
  savedByOthers = false,
}: {
  mode?: 'create' | 'edit'
  recipeId?: string
  initialValues?: CreateRecipeFormValues
  ingredientGroups?: DishDetails['ingredientGroups']
  savedByOthers?: boolean
}) => {
  const isEdit = mode === 'edit'
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [savedDraft] = useState(() => (isEdit ? null : readRecipeDraft()))
  const [photoLimitNote, setPhotoLimitNote] = useState(false)
  const [stepPhotoNote, setStepPhotoNote] = useState<number | null>(null)
  const [clearOpen, setClearOpen] = useState(false)
  const [draftOpen, setDraftOpen] = useState(savedDraft !== null)
  const [originalKeys] = useState(
    () => new Set(initialValues ? photoKeys(initialValues) : []),
  )

  const schema = useMemo(() => createRecipeSchema(t), [t])
  const draftSchema = useMemo(() => createRecipeSchema(t, 'draft'), [t])
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<CreateRecipeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? savedDraft ?? emptyForm(),
  })

  const draftAutosave = useAutosaveDraft({
    enabled: !isEdit,
    intervalMs: RECIPE_DRAFT_AUTOSAVE_MS,
    save: () => {
      const values = getValues()
      if (!isRecipeStarted(values)) return
      saveRecipeDraft(values)
    },
  })

  const galleryPhotos = watch('photos')
  const stepValues = watch('steps')

  useEffect(() => {
    if (!isSubmitted) return
    void trigger()
  }, [i18n.language, isSubmitted, trigger])

  const ingredients = useFieldArray({ control, name: 'ingredients' })
  const steps = useFieldArray({ control, name: 'steps' })

  const categoriesQuery = useQuery({
    queryKey: recipeQueryKeys.categories(),
    queryFn: () => recipesApi.listCategories(),
  })
  const unitsQuery = useQuery({
    queryKey: recipeQueryKeys.units(),
    queryFn: () => recipesApi.listUnits(),
  })

  const categories = categoriesQuery.data?.data ?? []
  const units = [...(unitsQuery.data?.data ?? [])].sort(
    (a, b) => a.order - b.order,
  )

  const deleteStoredFiles = (keys: string[]) =>
    Promise.all(
      keys.map((key) => recipesApi.deleteFile(key).catch(() => undefined)),
    )

  const deleteUnsavedFile = (key: string) => {
    if (originalKeys.has(key)) return
    void recipesApi.deleteFile(key).catch(() => undefined)
  }

  const uploadPhotos = async (files: File[]) => {
    if (files.length === 0) return []
    const uploaded: { key: string; url: string }[] = []

    try {
      for (const file of files) {
        uploaded.push(await recipesApi.uploadPhoto(file))
      }
      return uploaded
    } catch (error) {
      await deleteStoredFiles(uploaded.map((photo) => photo.key))
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
      return null
    }
  }

  const addPhotos = async (files: File[]) => {
    const room = DISH_PHOTO_LIMIT - getValues('photos').length
    if (room <= 0) {
      setPhotoLimitNote(true)
      return
    }
    const accepted = files.slice(0, room)
    setPhotoLimitNote(accepted.length < files.length)
    const uploaded = await uploadPhotos(accepted)
    if (!uploaded?.length) return
    setValue(
      'photos',
      [...getValues('photos'), ...uploaded].map((photo, order) => ({
        ...photo,
        order,
      })),
      { shouldDirty: true, shouldValidate: isSubmitted },
    )
  }

  const removePhoto = (key: string) => {
    setValue(
      'photos',
      getValues('photos')
        .filter((photo) => photo.key !== key)
        .map((photo, order) => ({ ...photo, order })),
      { shouldDirty: true, shouldValidate: isSubmitted },
    )
    deleteUnsavedFile(key)
    if (getValues('photos').length < DISH_PHOTO_LIMIT) setPhotoLimitNote(false)
  }

  const addStepPhotos = async (index: number, files: File[]) => {
    const room = STEP_PHOTO_LIMIT - getValues(`steps.${index}.photos`).length
    if (room <= 0) {
      setStepPhotoNote(index)
      return
    }
    const accepted = files.slice(0, room)
    setStepPhotoNote(accepted.length < files.length ? index : null)
    const uploaded = await uploadPhotos(accepted)
    if (!uploaded?.length) return
    setValue(
      `steps.${index}.photos`,
      [...getValues(`steps.${index}.photos`), ...uploaded].map((photo, order) => ({
        ...photo,
        order,
      })),
      { shouldDirty: true, shouldValidate: isSubmitted },
    )
  }

  const removeStepPhoto = (index: number, key: string) => {
    setValue(
      `steps.${index}.photos`,
      getValues(`steps.${index}.photos`)
        .filter((photo) => photo.key !== key)
        .map((photo, order) => ({ ...photo, order })),
      { shouldDirty: true, shouldValidate: isSubmitted },
    )
    deleteUnsavedFile(key)
    if (
      stepPhotoNote === index &&
      getValues(`steps.${index}.photos`).length < STEP_PHOTO_LIMIT
    ) {
      setStepPhotoNote(null)
    }
  }

  const removeStep = (index: number) => {
    void deleteStoredFiles(
      getValues(`steps.${index}.photos`)
        .map((photo) => photo.key)
        .filter((key) => !originalKeys.has(key)),
    )
    if (steps.fields.length === 1) {
      setStepPhotoNote(null)
      setValue('steps.0', emptyStep(), { shouldDirty: true })
      return
    }
    setStepPhotoNote(null)
    steps.remove(index)
  }

  const clearRecipe = async () => {
    const keys = photoKeys(getValues()).filter((key) => !originalKeys.has(key))
    draftAutosave.pause()
    if (!isEdit) clearRecipeDraft()
    reset(initialValues ?? emptyForm())
    setPhotoLimitNote(false)
    setStepPhotoNote(null)
    draftAutosave.resume()
    await deleteStoredFiles(keys)
  }

  const requestClear = () => {
    if (!isRecipeStarted(getValues())) {
      void clearRecipe()
      return
    }
    setClearOpen(true)
  }

  const handleSaveDraft = async () => {
    const values = getValues()
    const parsed = draftSchema.safeParse(values)
    if (!parsed.success) {
      clearErrors()
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.')
        if (!path) continue
        setError(path as FieldPath<CreateRecipeFormValues>, {
          message: issue.message,
        })
      }
      return
    }

    clearErrors()
    try {
      saveRecipeDraft(values)
      draftAutosave.pause()
      showToast(t('recipe.create.draftSaved'), 'success')
      void navigate({
        to: Routes.RECIPES,
      })
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...toCreateDishPayload(values, ingredientGroups),
      description: values.description.trim(),
      cookTime: values.cookTime.trim() ? Number(values.cookTime.trim()) : null,
    }

    try {
      if (isEdit && recipeId) {
        const updated = await recipesApi.update(recipeId, payload)
        const kept = new Set(photoKeys(values))
        await deleteStoredFiles(
          [...originalKeys].filter((key) => !kept.has(key)),
        )
        syncUpdatedDish(updated)
        showToast(t('recipe.edit.saved'), 'success')
        void navigate({
          to: Routes.RECIPE,
          params: { recipeId },
        })
        return
      }

      const dish = await recipesApi.create(toCreateDishPayload(values))
      draftAutosave.pause()
      clearRecipeDraft()
      void queryClient.invalidateQueries({ queryKey: ['dishes', 'list'] })

      showToast(t('recipe.create.published'), 'success')
      void navigate({
        to: Routes.RECIPE,
        params: { recipeId: dish.id },
      })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'DISH_CANNOT_MAKE_PRIVATE') {
        setValue('visibility', 'PUBLIC')
        showToast(t('recipe.edit.cannotMakePrivate'), 'error')
        return
      }
      const taken =
        error instanceof ApiError && error.code === 'DISH_TITLE_EXISTS'
      const message = taken
        ? t('recipe.create.titleTaken')
        : error instanceof Error
          ? error.message
          : t('error.serverError')
      if (taken) setError('title', { message })
      showToast(message, 'error')
    }
  })

  return (
    <>
    <form className="flex flex-col" onSubmit={onSubmit} noValidate>
      <h1 className="font-serif text-[28px] leading-[42px] font-normal text-foreground italic">
        {isEdit ? t('recipe.edit.title') : t('recipe.create.title')}
      </h1>

      <div className="mt-7 flex flex-col gap-[18px]">
        <SectionCard>
          <div className="flex flex-col gap-6">
            <FormFieldInput
              id="recipe-title"
              label={t('recipe.create.name')}
              placeholder={t('recipe.create.namePlaceholder')}
              maxLength={30}
              error={errors.title?.message}
              disabled={isSubmitting}
              required
              {...register('title')}
            />

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="recipe-description" className={formLabelClass}>
                {t('recipe.create.description')}
              </FieldLabel>
              <Textarea
                id="recipe-description"
                placeholder={t('recipe.create.descriptionPlaceholder')}
                maxLength={1000}
                aria-invalid={Boolean(errors.description)}
                disabled={isSubmitting}
                {...register('description')}
              />
              {errors.description?.message ? (
                <FieldError>{errors.description.message}</FieldError>
              ) : null}
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="cookTime"
                control={control}
                render={({ field }) => (
                  <PrepTimeField
                    value={field.value}
                    onChange={field.onChange}
                    invalid={Boolean(errors.cookTime)}
                    error={errors.cookTime?.message}
                  />
                )}
              />

              <Field data-invalid={Boolean(errors.categoryId)}>
                <FieldLabel className={formLabelClass}>
                  {t('recipe.create.category')}
                </FieldLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || null}
                      items={categories.map((category) => ({
                        value: category.id,
                        label: localizedName(i18n.language, category),
                      }))}
                      onValueChange={(value) => field.onChange(value ?? '')}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger aria-invalid={Boolean(errors.categoryId)}>
                        <SelectValue
                          placeholder={t('recipe.create.categoryPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {localizedName(i18n.language, category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId?.message ? (
                  <FieldError>{errors.categoryId.message}</FieldError>
                ) : null}
              </Field>

              <Field>
                <FieldLabel className={formLabelClass}>
                  {t('recipe.create.difficulty')}
                </FieldLabel>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <SegmentedChoice<DishDifficulty>
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'EASY', label: t('recipe.create.easy') },
                        { value: 'MEDIUM', label: t('recipe.create.medium') },
                        { value: 'HARD', label: t('recipe.create.hard') },
                      ]}
                    />
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className={formLabelClass}>
                  {t('recipe.create.visibility')}
                </FieldLabel>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <SegmentedChoice<DishVisibility>
                      value={field.value}
                      onChange={(next) => {
                        if (savedByOthers && next === 'PRIVATE') {
                          showToast(t('recipe.edit.cannotMakePrivate'), 'error')
                          return
                        }
                        field.onChange(next)
                      }}
                      options={[
                        {
                          value: 'PUBLIC',
                          label: t('recipe.create.public'),
                          icon: <Globe strokeWidth={1.5} />,
                        },
                        {
                          value: 'PRIVATE',
                          label: t('recipe.create.private'),
                          icon: <Lock strokeWidth={1.5} />,
                        },
                      ]}
                    />
                  )}
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t('recipe.create.photos')}>
          <div className="pt-1">
            <RecipePhotosField
              multiple
              hint={t('recipe.create.photoHint')}
              photos={galleryPhotos}
              error={errors.photos?.message}
              notice={photoLimitNote ? t('recipe.create.photoLimit') : undefined}
              disabled={isSubmitting}
              onSelect={(files) => void addPhotos(files)}
              onRemove={removePhoto}
            />
          </div>
        </SectionCard>

        <SectionCard title={t('recipe.create.ingredients')}>
          <div className="max-w-sm">
            <Controller
              name="servings"
              control={control}
              render={({ field }) => (
                <ServingsField
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.servings)}
                  error={errors.servings?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
          <div className="mt-6 hidden grid-cols-[minmax(0,1fr)_40px_112px_76px] gap-x-[7px] pl-0.5 md:grid">
            <span />
            <span />
            <span className="font-sans text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              {t('recipe.create.qty')}
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              {t('recipe.create.unit')}
            </span>
          </div>

          <div className="flex flex-col pt-2">
            {ingredients.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[minmax(0,1fr)_40px] items-start gap-x-[7px] gap-y-2 border-b border-divider py-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_40px_112px_76px]"
              >
                <div className="min-w-0">
                  <Controller
                    name={`ingredients.${index}.ingredient`}
                    control={control}
                    render={({ field: ingredientField }) => (
                      <IngredientCombobox
                        value={ingredientField.value}
                        onChange={ingredientField.onChange}
                        invalid={Boolean(
                          errors.ingredients?.[index]?.ingredient,
                        )}
                      />
                    )}
                  />
                  {errors.ingredients?.[index]?.ingredient?.message ? (
                    <FieldError className="mt-1">
                      {errors.ingredients[index]?.ingredient?.message}
                    </FieldError>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('recipe.create.removeIngredient')}
                  disabled={isSubmitting}
                  onClick={() => {
                    if (ingredients.fields.length === 1) {
                      setValue('ingredients.0', emptyIngredient(), {
                        shouldDirty: true,
                      })
                      return
                    }
                    ingredients.remove(index)
                  }}
                >
                  <X strokeWidth={1.5} />
                </Button>

                <div className="col-span-2 grid grid-cols-2 gap-[7px] md:contents">
                  <Controller
                    name={`ingredients.${index}.quantity`}
                    control={control}
                    render={({ field: quantityField }) => (
                      <QuantityField
                        value={quantityField.value}
                        onChange={quantityField.onChange}
                        onBlur={quantityField.onBlur}
                        disabled={isSubmitting}
                        error={errors.ingredients?.[index]?.quantity?.message}
                      />
                    )}
                  />

                  <div>
                  <Controller
                    name={`ingredients.${index}.unitId`}
                    control={control}
                    render={({ field: unitField }) => (
                      <Select
                        value={unitField.value || null}
                        items={units.map((unit) => ({
                          value: unit.id,
                          label: unitSymbol(i18n.language, unit),
                        }))}
                        onValueChange={(value) => unitField.onChange(value ?? '')}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          aria-invalid={Boolean(
                            errors.ingredients?.[index]?.unitId,
                          )}
                          aria-label={t('recipe.create.unit')}
                        >
                          <SelectValue
                            placeholder={t('recipe.create.unitPlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unitSymbol(i18n.language, unit)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.ingredients?.[index]?.unitId?.message ? (
                    <FieldError className="mt-1">
                      {errors.ingredients[index]?.unitId?.message}
                    </FieldError>
                  ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full"
            disabled={isSubmitting}
            onClick={() => ingredients.append(emptyIngredient())}
          >
            <Plus strokeWidth={1.5} />
            {t('recipe.create.addIngredient')}
          </Button>
        </SectionCard>

        <SectionCard title={t('recipe.create.instructions')}>
          <div className="flex flex-col gap-4 pt-1.5">
            {steps.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <span className="w-[30px] pt-1.5 font-serif text-2xl leading-none font-normal text-brand italic">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-6">
                    <FormFieldInput
                      label={t('recipe.create.stepTitle')}
                      placeholder={t('recipe.create.stepTitlePlaceholder')}
                      disabled={isSubmitting}
                      {...register(`steps.${index}.title`)}
                    />
                    <Field data-invalid={Boolean(errors.steps?.[index]?.description)}>
                      <FieldLabel className={formLabelClass}>
                        {t('recipe.create.stepDescription')}
                      </FieldLabel>
                      <Textarea
                        placeholder={t('recipe.create.stepDescriptionPlaceholder')}
                        aria-invalid={Boolean(errors.steps?.[index]?.description)}
                        disabled={isSubmitting}
                        {...register(`steps.${index}.description`)}
                      />
                      {errors.steps?.[index]?.description?.message ? (
                        <FieldError>
                          {errors.steps[index]?.description?.message}
                        </FieldError>
                      ) : null}
                    </Field>
                    <RecipePhotosField
                      multiple
                      label={t('recipe.create.stepPhoto')}
                      hint={t('recipe.create.stepPhotoHint')}
                      photos={stepValues[index]?.photos ?? []}
                      error={errors.steps?.[index]?.photos?.message}
                      notice={
                        stepPhotoNote === index
                          ? t('recipe.create.stepPhotoLimit')
                          : undefined
                      }
                      disabled={isSubmitting}
                      onSelect={(files) => void addStepPhotos(index, files)}
                      onRemove={(key) => removeStepPhoto(index, key)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t('recipe.create.removeStep')}
                    disabled={isSubmitting}
                    onClick={() => removeStep(index)}
                  >
                    <X strokeWidth={1.5} />
                  </Button>
                </div>
              ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full"
            disabled={isSubmitting}
            onClick={() => steps.append(emptyStep())}
          >
            <Plus strokeWidth={1.5} />
            {t('recipe.create.addStep')}
          </Button>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-3 pt-[26px]">
        {isEdit ? null : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
            onClick={requestClear}
          >
            <Broom strokeWidth={1.5} className="size-4" />
            {t('recipe.create.clear')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSaveDraft}
          >
            <Save strokeWidth={1.5} className="size-4" />
            {t('recipe.create.saveDraft')}
          </Button>
        </div>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          loadingText={
            isEdit ? t('recipe.edit.saving') : t('recipe.create.publishing')
          }
        >
          {isEdit ? (
            <Save strokeWidth={1.5} className="size-4" />
          ) : (
            <Send strokeWidth={1.5} className="size-4" />
          )}
          {isEdit ? t('recipe.edit.save') : t('recipe.create.publish')}
        </Button>
      </div>
    </form>
    <ConfirmationDialog
      open={clearOpen}
      onOpenChange={setClearOpen}
      title={t('recipe.create.clearConfirmTitle')}
      cancelLabel={t('recipe.create.clearConfirmNo')}
      confirmLabel={t('recipe.create.clearConfirmYes')}
      onConfirm={() => {
        setClearOpen(false)
        void clearRecipe()
      }}
    >
      {t('recipe.create.clearConfirmDescription')}
    </ConfirmationDialog>
    {isEdit ? null : (
    <ConfirmationDialog
      open={draftOpen}
      onOpenChange={setDraftOpen}
      title={t('recipe.create.draftResumeTitle')}
      cancelLabel={t('recipe.create.draftResumeContinue')}
      cancelVariant="primary"
      confirmLabel={t('recipe.create.draftResumeClear')}
      confirmVariant="secondary"
      onConfirm={() => {
        setDraftOpen(false)
        void clearRecipe()
      }}
    >
      {t('recipe.create.draftResumeDescription')}
    </ConfirmationDialog>
    )}
    </>
  )
}
