import { useTranslation } from 'react-i18next'

import { PageTitle } from '@components/common'

export const RecipesPage = () => {
  const { t } = useTranslation()

  return (
    <PageTitle className="font-serif text-[32px] leading-[48px] font-normal text-foreground italic">
      {t('recipe.list.title')}
    </PageTitle>
  )
}
