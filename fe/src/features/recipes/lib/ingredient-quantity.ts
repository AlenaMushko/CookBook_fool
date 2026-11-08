export const MIN_INGREDIENT_QUANTITY = 0.001
export const MAX_INGREDIENT_QUANTITY = 9_999_999.999

const roundQuantity = (value: number) => Math.round(value * 1000) / 1000

/** Keeps a partial draft: digits, one decimal separator, or one fraction slash. */
export const sanitizeQuantityInput = (raw: string) => {
  let text = ''
  let separator = ''

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      text += char
      continue
    }
    if (char !== '.' && char !== ',' && char !== '/') continue
    if (separator || text.length === 0) break
    separator = char
    text += char
  }

  return text
}

/** Positive integer, decimal (up to 3 places), or common fraction such as 1/2 or 1/3. */
export const parseIngredientQuantity = (raw: string) => {
  const text = raw.trim()
  if (!text) return null

  let value: number | null = null
  const fraction = /^(\d+)\/(\d+)$/.exec(text)
  if (fraction) {
    const denominator = Number(fraction[2])
    if (denominator > 0) value = Number(fraction[1]) / denominator
  } else if (/^\d+([.,]\d{1,3})?$/.test(text)) {
    value = Number(text.replace(',', '.'))
  }

  if (value == null || !Number.isFinite(value) || value <= 0) return null
  const rounded = roundQuantity(value)
  if (rounded < MIN_INGREDIENT_QUANTITY || rounded > MAX_INGREDIENT_QUANTITY) {
    return null
  }
  return rounded
}
