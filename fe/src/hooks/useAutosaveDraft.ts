import { useBlocker } from '@tanstack/react-router'
import { useCallback, useEffect, useRef } from 'react'

type AutosaveDraftOptions = {
  enabled?: boolean
  intervalMs: number
  save: () => void
}

export const useAutosaveDraft = ({
  enabled = true,
  intervalMs,
  save,
}: AutosaveDraftOptions) => {
  const saveRef = useRef(save)
  const pausedRef = useRef(false)

  useEffect(() => {
    saveRef.current = save
  })

  const persist = useCallback(() => {
    if (!enabled || pausedRef.current) return
    saveRef.current()
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const onPageHide = () => persist()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') persist()
    }

    const intervalId = window.setInterval(persist, intervalMs)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled, intervalMs, persist])

  useBlocker({
    disabled: !enabled,
    enableBeforeUnload: false,
    shouldBlockFn: () => {
      persist()
      return false
    },
  })

  return {
    pause() {
      pausedRef.current = true
    },
    resume() {
      pausedRef.current = false
    },
  }
}
