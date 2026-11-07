import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
        className="cursor-pointer text-[13px] text-brand underline underline-offset-[3px] hover:text-brand/80"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {t(open ? 'recipe.details.hideMeasures' : 'recipe.details.showMeasures')}
      </button>
      {open ? (
        <table className="mt-2 w-full text-left text-[13px] text-foreground">
          <caption className="sr-only">{name}</caption>
          <thead>
            <tr className="text-subtle">
              <th className="py-1.5 pr-3 font-normal">{t('recipe.details.measureIngredient')}</th>
              {measures.map((measure) => (
                <th key={measure.label} className="py-1.5 pr-3 font-normal">
                  {measure.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="py-2 pr-3">{name}</td>
              {measures.map((measure) => (
                <td key={measure.label} className="py-2 pr-3">
                  {t('recipe.details.measureGrams', { amount: formatGrams(measure.grams) })}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  )
}
