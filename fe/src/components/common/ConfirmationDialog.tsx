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
  confirmLabel?: string
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
  confirmLabel = "Delete",
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
      submitLabel={confirmLabel}
      submitVariant="destructive"
      isSubmitting={isSubmitting}
    >
      {children}
    </Modal>
  )
}
