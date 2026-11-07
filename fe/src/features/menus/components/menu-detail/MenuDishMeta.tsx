import { useTranslation } from 'react-i18next'

import { formatMinutes } from '@/features/recipes/lib/recipe-measures'

export const MenuDishMeta = ({
  cookTime,
  baseServings,
}: {
  cookTime?: number | null
  baseServings?: number | null
}) => {
  const { t } = useTranslation()
  const servings = baseServings && baseServings >= 1 ? Math.round(baseServings) : undefined
  const text = [
    cookTime ? formatMinutes(cookTime, t) : null,
    servings ? t('cookbook.portions', { count: servings }) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  if (!text) return null
  return <span className="mt-0.5 block text-[12px] text-subtle">{text}</span>
}
