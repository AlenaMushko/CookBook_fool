import type { ReactNode } from 'react'

import { Button } from '@components/ui/button'

export function SegmentedChoice<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; icon?: ReactNode }[]
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <Button
            key={option.value}
            type="button"
            variant={selected ? 'primary' : 'secondary'}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className="flex-1"
          >
            {option.icon}
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
