import * as React from "react"
import { Upload } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { IMAGE_ACCEPT, isAllowedImageFile } from "@/lib/image-file"
import { cn } from "@/lib/utils"

const MAX_SIZE_MB = 10

type ImageUploaderProps = {
  className?: string
  accept?: string
  maxSizeMb?: number
  disabled?: boolean
  multiple?: boolean
  title?: string
  titleClassName?: string
  hint?: string
  hintClassName?: string
  browseLabel?: string
  showBrowse?: boolean
  inputId?: string
  ariaLabel?: string
  icon?: React.ReactNode
  onFileSelect?: (file: File | null) => void
  onFilesSelect?: (files: File[]) => void
}

function ImageUploader({
  className,
  accept = IMAGE_ACCEPT,
  maxSizeMb = MAX_SIZE_MB,
  disabled = false,
  multiple = false,
  title,
  titleClassName,
  hint,
  hintClassName,
  browseLabel,
  showBrowse = true,
  inputId,
  ariaLabel,
  icon,
  onFileSelect,
  onFilesSelect,
}: ImageUploaderProps) {
  const { t } = useTranslation()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const requestRef = React.useRef(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const titleText = title ?? t("file.dropTitle")
  const hintText = hint ?? t("file.hint", { size: maxSizeMb })
  const browseText = browseLabel ?? t("file.browse")

  const acceptFiles = async (files: File[]) => {
    const request = ++requestRef.current
    setError(null)
    if (files.length === 0) {
      onFileSelect?.(null)
      onFilesSelect?.([])
      return
    }

    const valid: File[] = []
    for (const file of files) {
      if (!(await isAllowedImageFile(file))) {
        if (request !== requestRef.current) return
        setError(t("file.unsupported"))
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        if (request !== requestRef.current) return
        setError(t("file.tooLarge", { size: maxSizeMb }))
        continue
      }
      valid.push(file)
    }

    if (request !== requestRef.current) return

    if (multiple) {
      onFilesSelect?.(valid)
      return
    }

    onFileSelect?.(valid[0] ?? null)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void acceptFiles(Array.from(e.target.files ?? []))
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files ?? [])
    void acceptFiles(multiple ? files : files.slice(0, 1))
  }

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      data-slot="image-uploader"
      data-dragging={isDragging || undefined}
      onDragEnter={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        setIsDragging(false)
      }}
      onDrop={onDrop}
      onClick={showBrowse ? undefined : openPicker}
      onKeyDown={
        showBrowse
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openPicker()
              }
            }
      }
      role={showBrowse ? undefined : "button"}
      tabIndex={showBrowse || disabled ? undefined : 0}
      className={cn(
        "flex w-full max-w-[280px] flex-col items-center",
        "rounded-lg border-2 border-dashed border-border bg-input-bg",
        "gap-3 px-3.5 py-5 md:gap-3.5 md:px-3.5 md:py-5",
        "text-center transition-colors",
        "data-[dragging]:border-input-hover data-[dragging]:bg-secondary",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      {icon ?? (
        <Upload
          strokeWidth={1.5}
          aria-hidden
          className="size-[22px] shrink-0 text-subtle"
        />
      )}

      <div className="flex w-full flex-col items-center gap-1">
        <p
          className={cn(
            "font-sans text-btn font-semibold text-foreground",
            titleClassName
          )}
        >
          {titleText}
        </p>
        <p
          className={cn(
            "font-sans text-[12px] leading-[18px] font-normal text-muted-foreground",
            hintClassName
          )}
        >
          {hintText}
        </p>
        {error ? (
          <p className="font-sans text-[12px] leading-[18px] text-error">
            {error}
          </p>
        ) : null}
      </div>

      {showBrowse ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            openPicker()
          }}
        >
          {browseText}
        </Button>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        aria-label={ariaLabel}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={onInputChange}
      />
    </div>
  )
}

export { ImageUploader }
