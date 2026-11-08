import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const photo = photos[index]
  const hasMany = photos.length > 1

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()
    return () => opener?.focus()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return
      if (event.altKey || event.ctrlKey || event.metaKey) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight' && hasMany) {
        event.preventDefault()
        onIndexChange((index + 1) % photos.length)
        return
      }
      if (event.key === 'ArrowLeft' && hasMany) {
        event.preventDefault()
        onIndexChange((index - 1 + photos.length) % photos.length)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ]
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const inside = active instanceof Node && dialog.contains(active)
      if (!inside || active === dialog) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey, true)
    }
  }, [hasMany, index, onClose, onIndexChange, photos.length])

  if (!photo) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('recipe.details.photoViewer')}
      tabIndex={-1}
      className="animate-in fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-6 duration-200 outline-none"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <p className="sr-only" aria-live="polite">
        {t('recipe.details.photoCount', {
          current: index + 1,
          total: photos.length,
        })}
      </p>
      {hasMany ? (
        <button
          type="button"
          aria-label={t('recipe.details.prevPhoto')}
          onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
          className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-150 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-8"
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
          className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors duration-150 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      {hasMany ? (
        <button
          type="button"
          aria-label={t('recipe.details.nextPhoto')}
          onClick={() => onIndexChange((index + 1) % photos.length)}
          className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-150 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-8"
        >
          <ChevronRight className="size-6" strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  )
}
