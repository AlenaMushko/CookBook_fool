import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { DishPhotoRef } from '../types/recipe.types'
import { RecipeImage } from './RecipeImage'

export const RecipePhotoViewer = ({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: DishPhotoRef[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}) => {
  const { t } = useTranslation()
  const photo = photos[index]
  const hasMany = photos.length > 1

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' && hasMany) {
        onIndexChange((index + 1) % photos.length)
      }
      if (event.key === 'ArrowLeft' && hasMany) {
        onIndexChange((index - 1 + photos.length) % photos.length)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [hasMany, index, onClose, onIndexChange, photos.length])

  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('recipe.details.photoViewer')}
      className="animate-in fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-6 duration-200"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {hasMany ? (
        <button
          type="button"
          aria-label={t('recipe.details.prevPhoto')}
          onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
          className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-150 hover:bg-white/30 md:left-8"
        >
          <ChevronLeft className="size-6" strokeWidth={1.5} />
        </button>
      ) : null}

      <div className="relative w-fit max-h-[80vh] max-w-[80vw]">
        <RecipeImage
          key={`${photo.key}-${index}`}
          src={photo.url}
          className="animate-in fade-in block h-auto max-h-[80vh] w-auto max-w-[80vw] min-h-0 min-w-0 rounded-lg object-contain duration-200"
        />
        <button
          type="button"
          aria-label={t('recipe.details.closePhoto')}
          onClick={onClose}
          className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors duration-150 hover:bg-black/75"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      {hasMany ? (
        <button
          type="button"
          aria-label={t('recipe.details.nextPhoto')}
          onClick={() => onIndexChange((index + 1) % photos.length)}
          className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-150 hover:bg-white/30 md:right-8"
        >
          <ChevronRight className="size-6" strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  )
}
