import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ApiError } from '@api/client'
import { PageTitle } from '@components/common'
import { shoppingListQueryOptions } from '@/features/menus'
import { ShoppingListView } from '@/features/menus/components/ShoppingListView'

export const ShoppingListPage = () => {
  const { menuId } = useParams({ from: '/(public)/menus/$menuId/shopping-list' })
  const { t } = useTranslation()
  const query = useQuery(shoppingListQueryOptions(menuId))

  if (query.isPending || query.isFetching) {
    return (
      <PageTitle className="text-subtle">{t('menus.shopping.loading')}</PageTitle>
    )
  }

  if (query.isError || !query.data) {
    const missing = query.error instanceof ApiError && query.error.status === 404
    return (
      <PageTitle className="text-subtle">
        {t(missing ? 'menus.shopping.notFound' : 'menus.shopping.loadFailed')}
      </PageTitle>
    )
  }

  return <ShoppingListView list={query.data} />
}
