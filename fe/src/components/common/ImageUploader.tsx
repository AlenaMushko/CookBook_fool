import * as React from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_SIZE_MB = 10
const ACCEPT = "image/png,image/jpeg,image/jpg"

type ImageUploaderProps = {
  className?: string
  accept?: string
  maxSizeMb?: number
  disabled?: boolean
  title?: string
  hint?: string
  browseLabel?: string
  onFileSelect?: (file: File | null) => void
}

function ImageUploader({
  className,
  accept = ACCEPT,
  maxSizeMb = MAX_SIZE_MB,
  disabled = false,
  title = "Drop your photo here",
  hint,
  browseLabel = "Browse Files",
  onFileSelect,
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const hintText = hint ?? `PNG, JPG up to ${maxSizeMb} MB`

  const validateAndSelect = (file: File | null) => {
    setError(null)
    if (!file) {
      onFileSelect?.(null)
      return
    }

    const allowed = accept.split(",").map((t) => t.trim())
    const typeOk =
      allowed.includes(file.type) ||
      allowed.some(
        (t) => t.startsWith(".") && file.name.toLowerCase().endsWith(t)
      )

    if (!typeOk) {
      setError("Use PNG or JPG")
      onFileSelect?.(null)
      return
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Max size is ${maxSizeMb} MB`)
      onFileSelect?.(null)
      return
    }

    onFileSelect?.(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    validateAndSelect(file)
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0] ?? null
    validateAndSelect(file)
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
      <Upload
        strokeWidth={1.5}
        aria-hidden
        className="size-[22px] shrink-0 text-subtle"
      />

      <div className="flex flex-col items-center gap-1">
        <p className="font-sans text-btn font-semibold text-foreground">
          {title}
        </p>
        <p className="font-sans text-[12px] leading-[18px] font-normal text-muted-foreground">
          {hintText}
        </p>
        {error ? (
          <p className="font-sans text-[12px] leading-[18px] text-error">
            {error}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {browseLabel}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={onInputChange}
      />
    </div>
  )
}

export { ImageUploader }
