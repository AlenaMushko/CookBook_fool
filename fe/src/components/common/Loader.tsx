import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'

export const Loader = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isLoading = isFetching + isMutating > 0

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner className="size-8 text-primary" />
    </div>
  )
}
