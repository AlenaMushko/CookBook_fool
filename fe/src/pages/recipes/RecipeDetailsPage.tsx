import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { RecipeDetails } from '@/features/recipes/components/RecipeDetails'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { useAuthSession } from '@/hooks/useAuthSession'

export const RecipeDetailsPage = ({ recipeId }: { recipeId: string }) => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthSession()
  const dishQuery = useQuery({
    queryKey: [...recipeQueryKeys.dish(recipeId), isAuthenticated ? 'me' : 'guest'],
    queryFn: () => recipesApi.getById(recipeId),
  })
  const unitsQuery = useQuery({
    queryKey: recipeQueryKeys.units(),
    queryFn: () => recipesApi.listUnits(),
  })

  if (dishQuery.isPending || unitsQuery.isPending) {
    return <p className="text-subtle">{t('recipe.details.loading')}</p>
  }

  if (dishQuery.isError || !dishQuery.data) {
    return <p className="text-subtle">{t('recipe.details.notFound')}</p>
  }

  if (unitsQuery.isError) {
    return <p className="text-subtle">{t('recipe.details.unitsError')}</p>
  }

  return (
    <RecipeDetails
      key={dishQuery.data.id}
      dish={dishQuery.data}
      units={unitsQuery.data?.data ?? []}
    />
  )
}
