import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageTitle } from '@components/common'
import { Routes } from '@constants/routes'
import { recipesApi } from '@/features/recipes/api/recipes.api'
import { recipeQueryKeys } from '@/features/recipes/api/recipes.queries'
import { CreateRecipeForm } from '@/features/recipes/components/CreateRecipeForm'
import { dishToFormValues } from '@/features/recipes/lib/dish-to-form'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const EditRecipePage = ({ recipeId }: { recipeId: string }) => {
  const { t } = useTranslation()
  const { user, isLoading } = useCurrentUser()
  const dishQuery = useQuery({
    queryKey: [...recipeQueryKeys.dish(recipeId), 'me'],
    queryFn: () => recipesApi.getById(recipeId),
  })
  const isOwner =
    dishQuery.data?.isOwner === true ||
    (user?.id != null && user.id === dishQuery.data?.owner.id)

  if (dishQuery.isPending || isLoading) {
    return <PageTitle className="text-subtle">{t('recipe.details.loading')}</PageTitle>
  }

  if (dishQuery.isError || !dishQuery.data) {
    return (
      <div className="flex flex-col gap-3">
        <PageTitle className="text-subtle">{t('recipe.details.notFound')}</PageTitle>
        <Link to={Routes.RECIPES} className="w-fit text-[14px] text-brand">
          {t('recipe.details.library')}
        </Link>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="flex flex-col gap-3">
        <PageTitle className="text-subtle">{t('recipe.details.editForbidden')}</PageTitle>
        <Link
          to={Routes.RECIPE}
          params={{ recipeId }}
          className="w-fit text-[14px] text-brand"
        >
          {t('recipe.details.backToRecipe')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-form pt-3.5 pb-[60px]">
      <CreateRecipeForm
        key={dishQuery.data.id}
        mode="edit"
        recipeId={recipeId}
        initialValues={dishToFormValues(dishQuery.data)}
        ingredientGroups={dishQuery.data.ingredientGroups}
      />
    </div>
  )
}
