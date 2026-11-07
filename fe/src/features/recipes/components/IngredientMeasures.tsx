import { ChevronRight, Table2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

const TABLESPOONS_PER_CUP = 16
const TEASPOONS_PER_CUP = 48

const formatGrams = (value: number) => {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export const IngredientMeasures = ({
  name,
  gramsPerCup,
}: {
  name: string
  gramsPerCup: number
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const measures = [
    { label: t('recipe.details.measureCup'), grams: gramsPerCup },
    { label: t('recipe.details.measureTbsp'), grams: gramsPerCup / TABLESPOONS_PER_CUP },
    { label: t('recipe.details.measureTsp'), grams: gramsPerCup / TEASPOONS_PER_CUP },
  ]

  return (
    <div className="pl-12">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-primary/10 px-3.5 py-2 text-[14px] font-medium text-primary transition-colors hover:bg-primary/15"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Table2 className="size-4 shrink-0" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 text-left">
          {t(open ? 'recipe.details.hideMeasures' : 'recipe.details.showMeasures')}
        </span>
        <ChevronRight
          className={cn('size-4 shrink-0 transition-transform', open && 'rotate-90')}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <div className="mt-2 rounded-2xl bg-primary/10 px-4 py-3">
          <table className="w-full text-left text-[14px] text-foreground">
            <caption className="sr-only">{name}</caption>
            <thead>
              <tr className="text-[13px] text-primary/70">
                <th className="pb-2 pr-3 font-normal">{t('recipe.details.measureIngredient')}</th>
                {measures.map((measure) => (
                  <th key={measure.label} className="pb-2 pr-3 font-normal">
                    {measure.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-3">{name}</td>
                {measures.map((measure) => (
                  <td key={measure.label} className="pr-3">
                    {t('recipe.details.measureGrams', { amount: formatGrams(measure.grams) })}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
