import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void | Promise<void>
  onClose?: () => void
  cancelLabel?: string
  submitLabel?: string
  submitVariant?: "primary" | "destructive"
  isSubmitting?: boolean
  showCloseButton?: boolean
  className?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  onClose,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  submitVariant = "primary",
  isSubmitting = false,
  showCloseButton = true,
  className,
}: ModalProps) {
  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) onClose?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    await onSubmit?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <DialogBody>{children}</DialogBody>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="modal"
                  disabled={isSubmitting}
                />
              }
            >
              {cancelLabel}
            </DialogClose>

            <Button
              type="submit"
              variant={submitVariant}
              size="modal"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
