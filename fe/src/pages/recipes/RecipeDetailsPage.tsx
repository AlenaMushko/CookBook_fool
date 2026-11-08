import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { PageTitle } from '@components/common'
import { RecipeDetails } from '@/features/recipes/components/RecipeDetails'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { useViewerKey } from '@/lib/session-user'

export const RecipeDetailsPage = ({ recipeId }: { recipeId: string }) => {
  const { t } = useTranslation()
  const viewer = useViewerKey()
  const dishQuery = useQuery({
    queryKey: [...recipeQueryKeys.dish(recipeId), viewer ?? 'pending'],
    queryFn: () => recipesApi.getById(recipeId),
    enabled: viewer != null,
  })
  const unitsQuery = useQuery({
    queryKey: recipeQueryKeys.units(),
    queryFn: () => recipesApi.listUnits(),
  })

  if (dishQuery.isPending || unitsQuery.isPending) {
    return <PageTitle className="text-subtle">{t('recipe.details.loading')}</PageTitle>
  }

  if (dishQuery.isError || !dishQuery.data) {
    return <PageTitle className="text-subtle">{t('recipe.details.notFound')}</PageTitle>
  }

  if (unitsQuery.isError) {
    return <PageTitle className="text-subtle">{t('recipe.details.unitsError')}</PageTitle>
  }

  return (
    <RecipeDetails
      key={dishQuery.data.id}
      dish={dishQuery.data}
      units={unitsQuery.data?.data ?? []}
    />
  )
}
