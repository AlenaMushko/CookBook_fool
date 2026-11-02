export const recipeQueryKeys = {
  categories: () => ['dishes', 'categories'] as const,
  units: () => ['measurement-units'] as const,
  ingredients: (search: string) => ['ingredients', search] as const,
}

export const recipesQueries = {
  recipeQueryKeys,
}
