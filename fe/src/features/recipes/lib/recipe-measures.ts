type Translate = (key: string, options?: Record<string, number>) => string

export const formatAmount = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000
  return String(rounded)
}

export const formatMinutes = (minutes: number | undefined, t: Translate) => {
  if (!minutes) return '—'
  if (minutes < 60) return t('recipe.create.minutesShort', { count: minutes })
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (rest === 0) return t('recipe.create.hoursShort', { count: hours })
  return t('recipe.create.hoursMinutes', { hours, minutes: rest })
}
