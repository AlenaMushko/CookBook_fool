import { Camera, Trash2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ConfirmationDialog } from '@components/common/ConfirmationDialog'
import { Modal } from '@components/common/Modal'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Button } from '@components/ui/button'
import { FieldError } from '@components/ui/field'
import { FormFieldInput } from '@components/ui/form-field-input'
import { Routes } from '@constants/routes'
import { signOut } from '@/features/auth/lib/sign-out'
import { resolveMediaUrl } from '@/lib/media-url'
import { showToast } from '@/lib/toast'
import { getUserDisplayName, getUserInitials } from '@/lib/user-display'

import { profileApi } from '../api/profile.api'
import { profileQueryKeys } from '../api/profile.queries'
import {
  createProfileSchema,
  type ProfileFormValues,
} from '../schemas/profile.schema'
import type { Profile } from '../types/profile.types'

type ProfileFormProps = {
  profile: Profile
}

type ConfirmKind = 'save' | 'cancel' | 'password' | 'deletePhoto' | null

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Pending (unsaved) upload key — ref so replace/cancel cleanup cannot miss it.
  const pendingUploadKeyRef = useRef<string | null>(null)

  const [imageKey, setImageKey] = useState(profile.image ?? null)
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPasswordSending, setIsPasswordSending] = useState(false)
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false)

  const savedImageKey = profile.image ?? null

  const deleteS3KeyBestEffort = async (key: string | null | undefined) => {
    if (!key) return
    try {
      await profileApi.deleteFile(key)
    } catch {
      // best-effort: avoid blocking UI if object is already gone
    }
  }

  const schema = useMemo(() => createProfileSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
    setError,
    clearErrors,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
    },
    mode: 'onBlur',
  })

  const imageDirty = imageKey !== savedImageKey
  const hasChanges = isDirty || imageDirty
  const hasPhoto = Boolean(imageKey || previewUrl)

  const displayName =
    getUserDisplayName({
      firstName: getValues('firstName') || profile.firstName,
      lastName: getValues('lastName') || profile.lastName,
    }) || profile.email

  const initials = getUserInitials({
    firstName: getValues('firstName') || profile.firstName,
    lastName: getValues('lastName') || profile.lastName,
    email: profile.email,
  })

  const avatarSrc =
    previewUrl || resolveMediaUrl(imageKey, imageUrl)

  const persistProfile = async () => {
    clearErrors('root')
    const values = getValues()
    const previousSavedKey = savedImageKey

    try {
      const updated = await profileApi.updateMe({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim() ? values.phone.trim() : null,
        image: imageKey,
      })

      pendingUploadKeyRef.current = null

      // Belt-and-suspenders: backend also deletes previousImage on PATCH.
      if (previousSavedKey && previousSavedKey !== (updated.image ?? null)) {
        void deleteS3KeyBestEffort(previousSavedKey)
      }

      queryClient.setQueryData(profileQueryKeys.me(), updated)
      reset({
        firstName: updated.firstName ?? '',
        lastName: updated.lastName ?? '',
        email: updated.email ?? '',
        phone: updated.phone ?? '',
      })
      setImageKey(updated.image ?? null)
      setImageUrl(updated.imageUrl ?? null)
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      showToast(t('user.profileUpdated'), 'success')
      setConfirmKind(null)
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error ? error.message : t('error.serverError'),
      })
      setConfirmKind(null)
    }
  }

  const discardChanges = async () => {
    const pendingKey = pendingUploadKeyRef.current
      ?? (imageKey && imageKey !== savedImageKey ? imageKey : null)

    pendingUploadKeyRef.current = null
    await deleteS3KeyBestEffort(pendingKey)

    reset({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
    })
    setImageKey(savedImageKey)
    setImageUrl(profile.imageUrl ?? null)
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    clearErrors()
    setConfirmKind(null)
    void navigate({ to: Routes.HOME })
  }

  const onSaveClick = () => {
    if (!hasChanges) return
    void handleSubmit(() => setConfirmKind('save'))()
  }

  const onCancelClick = () => {
    if (!hasChanges) {
      void navigate({ to: Routes.HOME })
      return
    }
    setConfirmKind('cancel')
  }

  const onPhotoSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsUploading(true)
    clearErrors('root')

    const localPreview = URL.createObjectURL(file)
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return localPreview
    })

    const previousPending =
      pendingUploadKeyRef.current
      ?? (imageKey && imageKey !== savedImageKey ? imageKey : null)

    try {
      const { key } = await profileApi.uploadAvatar(file)
      pendingUploadKeyRef.current = key
      setImageKey(key)
      setImageUrl(null)

      if (previousPending && previousPending !== key) {
        void deleteS3KeyBestEffort(previousPending)
      }

      showToast(t('file.uploadSuccess'), 'success')
    } catch (error) {
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      setError('root', {
        message:
          error instanceof Error ? error.message : t('file.uploadFail'),
      })
      showToast(t('file.uploadFail'), 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const deletePhoto = async () => {
    if (!imageKey) {
      setConfirmKind(null)
      return
    }

    setIsDeletingPhoto(true)
    clearErrors('root')

    try {
      const isSavedPhoto = imageKey === savedImageKey
      const keyToRemove = imageKey

      if (isSavedPhoto) {
        const updated = await profileApi.updateMe({ image: null })
        pendingUploadKeyRef.current = null
        queryClient.setQueryData(profileQueryKeys.me(), updated)
        setImageKey(null)
        setImageUrl(null)
        // Backend deletes on PATCH; FE retry if that silently failed.
        void deleteS3KeyBestEffort(keyToRemove)
      } else {
        pendingUploadKeyRef.current = null
        await deleteS3KeyBestEffort(keyToRemove)
        setImageKey(savedImageKey)
        setImageUrl(profile.imageUrl ?? null)
      }

      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      showToast(t('file.removeSuccess'), 'success')
      setConfirmKind(null)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t('file.removeFail'),
        'error',
      )
      setConfirmKind(null)
    } finally {
      setIsDeletingPhoto(false)
    }
  }

  const sendPasswordChangeEmail = async () => {
    setIsPasswordSending(true)
    try {
      const result = await profileApi.requestPasswordChange()
      showToast(result.message || t('user.checkEmail'), 'success')
      setConfirmKind(null)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t('error.serverError'),
        'error',
      )
      setConfirmKind(null)
    } finally {
      setIsPasswordSending(false)
    }
  }

  return (
    <>
      <form
        className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-2xl bg-card p-6 shadow-sm md:p-8"
        onSubmit={(event) => {
          event.preventDefault()
          onSaveClick()
        }}
        noValidate
      >
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-heading text-h2 text-foreground">
            {t('profile')}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-outline-foreground"
            onClick={onCancelClick}
            aria-label={t('close')}
          >
            ✕
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar size="lg" className="size-20 md:size-24">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-brand text-btn font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-0.5 -right-0.5 flex size-8 items-center justify-center rounded-full border border-secondary-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSubmitting || isDeletingPhoto}
              aria-label={t('profilePage.changePhoto')}
            >
              <Camera className="size-4" strokeWidth={1.8} aria-hidden />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void onPhotoSelected(event)}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate font-sans text-body font-semibold text-foreground">
              {displayName}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="text-body font-medium text-brand underline-offset-4 hover:underline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isSubmitting || isDeletingPhoto}
              >
                {t('profilePage.changePhoto')}
              </button>

              {hasPhoto ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-body font-medium text-destructive underline-offset-4 hover:underline"
                  onClick={() => setConfirmKind('deletePhoto')}
                  disabled={isUploading || isSubmitting || isDeletingPhoto}
                  aria-label={t('profilePage.deletePhoto')}
                >
                  <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
                  {t('profilePage.deletePhoto')}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <FormFieldInput
            id="profile-first-name"
            label={t('user.firstName')}
            autoComplete="given-name"
            error={errors.firstName?.message}
            disabled={isSubmitting}
            required
            {...register('firstName')}
          />

          <FormFieldInput
            id="profile-last-name"
            label={t('user.lastName')}
            autoComplete="family-name"
            error={errors.lastName?.message}
            disabled={isSubmitting}
            required
            {...register('lastName')}
          />

          <FormFieldInput
            id="profile-email"
            label={t('user.email')}
            type="email"
            autoComplete="email"
            disabled
            {...register('email')}
          />

          <FormFieldInput
            id="profile-phone"
            label={t('user.phone')}
            type="tel"
            autoComplete="tel"
            placeholder={t('user.enterPhone')}
            error={errors.phone?.message}
            disabled={isSubmitting}
            {...register('phone')}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isSubmitting || isPasswordSending}
          onClick={() => setConfirmKind('password')}
        >
          {t('profilePage.changePassword')}
        </Button>

        {errors.root ? (
          <FieldError className="rounded-md border border-error-border bg-error-bg px-3 py-2">
            {errors.root.message}
          </FieldError>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isSubmitting || isDeletingPhoto}
            onClick={onCancelClick}
          >
            {t('cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!hasChanges || isSubmitting || isUploading || isDeletingPhoto}
            isLoading={isSubmitting}
            loadingText={t('profilePage.saving')}
          >
            {t('profilePage.saveChanges')}
          </Button>
        </div>

        <button
          type="button"
          className="text-body font-medium text-destructive underline-offset-4 hover:underline"
          onClick={() =>
            void signOut().then(() => navigate({ to: Routes.LOGIN }))
          }
        >
          {t('logout')}
        </button>
      </form>

      <Modal
        open={confirmKind === 'save'}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null)
        }}
        title={t('profilePage.confirmSaveTitle')}
        submitLabel={t('profilePage.saveChanges')}
        cancelLabel={t('cancel')}
        submitVariant="primary"
        isSubmitting={isSubmitting}
        onSubmit={() => void persistProfile()}
      >
        <p className="text-body text-muted-foreground">
          {t('profilePage.confirmSaveDescription')}
        </p>
      </Modal>

      <ConfirmationDialog
        open={confirmKind === 'cancel'}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null)
        }}
        title={t('profilePage.confirmDiscardTitle')}
        confirmLabel={t('profilePage.discardChanges')}
        cancelLabel={t('profilePage.keepEditing')}
        onConfirm={() => void discardChanges()}
      >
        <p className="text-body text-muted-foreground">
          {t('profilePage.confirmDiscardDescription')}
        </p>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={confirmKind === 'deletePhoto'}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null)
        }}
        title={t('profilePage.confirmDeletePhotoTitle')}
        confirmLabel={t('profilePage.deletePhoto')}
        cancelLabel={t('cancel')}
        isSubmitting={isDeletingPhoto}
        onConfirm={() => void deletePhoto()}
      >
        <p className="text-body text-muted-foreground">
          {t('profilePage.confirmDeletePhotoDescription')}
        </p>
      </ConfirmationDialog>

      <Modal
        open={confirmKind === 'password'}
        onOpenChange={(open) => {
          if (!open) setConfirmKind(null)
        }}
        title={t('profilePage.confirmPasswordTitle')}
        submitLabel={t('profilePage.sendResetLink')}
        cancelLabel={t('cancel')}
        submitVariant="primary"
        isSubmitting={isPasswordSending}
        onSubmit={() => void sendPasswordChangeEmail()}
      >
        <p className="text-body text-muted-foreground">
          {t('profilePage.confirmPasswordDescription', {
            email: profile.email,
          })}
        </p>
      </Modal>
    </>
  )
}
