import { toast } from '@/components/ui/toast'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

const DEFAULT_TIMEOUT = 2000

export function showToast(message: string, type: ToastType = 'info') {
  toast.add({
    title: message,
    type,
    timeout: DEFAULT_TIMEOUT,
  })
}
