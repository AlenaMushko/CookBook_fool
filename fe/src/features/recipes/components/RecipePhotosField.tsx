import { Camera, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ImageUploader } from '@components/common/ImageUploader'
import { Button } from '@components/ui/button'
import { Field, FieldError, FieldLabel } from '@components/ui/field'

import { RecipeImage } from './RecipeImage'

const formLabelClass = 'text-label uppercase tracking-[0.12em]'

export const RecipePhotosField = ({
  photos,
  hint,
  label,
  error,
  notice,
  multiple = false,
  disabled = false,
  onSelect,
  onRemove,
}: {
  photos: { key: string; url: string }[]
  hint: string
  label?: string
  error?: string
  notice?: string
  multiple?: boolean
  disabled?: boolean
  onSelect: (files: File[]) => void
  onRemove: (key: string) => void
}) => {
  const { t } = useTranslation()

  return (
    <Field>
      {label ? <FieldLabel className={formLabelClass}>{label}</FieldLabel> : null}
      <ImageUploader
        multiple={multiple}
        showBrowse={false}
        disabled={disabled}
        title={t('recipe.create.photoTitle')}
        hint={hint}
        icon={
          <Camera
            strokeWidth={1.5}
            aria-hidden
            className="size-[26px] text-muted-foreground"
          />
        }
        onFilesSelect={onSelect}
        onFileSelect={(file) => onSelect(file ? [file] : [])}
        titleClassName="text-[13px] font-normal text-muted-foreground"
        hintClassName="text-[11px] leading-[16.5px] text-subtle"
        className="max-w-none cursor-pointer items-start gap-2.5 bg-muted px-6 py-9"
      />
      {photos.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo) => (
            <li key={photo.key} className="relative">
              <RecipeImage src={photo.url} className="size-16 rounded-md object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                aria-label={t('recipe.create.removePhoto')}
                disabled={disabled}
                onClick={() => onRemove(photo.key)}
                className="absolute -top-1.5 -right-1.5"
              >
                <X strokeWidth={1.5} />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {notice ? (
        <p className="mt-3 text-[13px] leading-5 font-medium text-brand">{notice}</p>
      ) : null}
      {error ? <FieldError className="mt-2">{error}</FieldError> : null}
    </Field>
  )
}
