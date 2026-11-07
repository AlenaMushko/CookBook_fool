export const RECIPE_SEARCH_MIN_LENGTH = 3
export const RECIPE_SEARCH_DELAY_MS = 800

export const activeRecipeSearch = (value: string) => {
  const text = value.trim()
  return text.length >= RECIPE_SEARCH_MIN_LENGTH ? text : undefined
}
