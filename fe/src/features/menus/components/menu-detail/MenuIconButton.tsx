import type { ReactNode } from 'react'

export const MenuIconButton = ({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className="cursor-pointer rounded-md p-1.5 text-subtle transition-colors duration-200 hover:bg-secondary hover:text-foreground"
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.stopPropagation()
      onClick()
    }}
  >
    {children}
  </button>
)
