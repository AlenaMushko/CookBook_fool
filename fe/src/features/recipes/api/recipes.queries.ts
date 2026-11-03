export const recipeQueryKeys = {
  categories: () => ['dishes', 'categories'] as const,
  dish: (id: string) => ['dishes', id] as const,
  units: () => ['measurement-units'] as const,
  ingredients: (search: string) => ['ingredients', search] as const,
}

export const recipesQueries = {
  recipeQueryKeys,
}
