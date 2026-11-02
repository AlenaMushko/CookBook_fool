import type { ReactNode } from "react"

import { Modal } from "@/components/common/Modal"

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  onConfirm?: () => void | Promise<void>
  onClose?: () => void
  cancelLabel?: string
  cancelVariant?: "primary" | "secondary" | "destructive"
  confirmLabel?: string
  confirmVariant?: "primary" | "secondary" | "destructive"
  isSubmitting?: boolean
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  children,
  onConfirm,
  onClose,
  cancelLabel = "Cancel",
  cancelVariant = "secondary",
  confirmLabel = "Delete",
  confirmVariant = "destructive",
  isSubmitting,
}: ConfirmationDialogProps) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSubmit={onConfirm}
      onClose={onClose}
      cancelLabel={cancelLabel}
      cancelVariant={cancelVariant}
      submitLabel={confirmLabel}
      submitVariant={confirmVariant}
      isSubmitting={isSubmitting}
    >
      {children}
    </Modal>
  )
}
