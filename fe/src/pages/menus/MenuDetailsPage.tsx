import { useSuspenseQuery } from '@tanstack/react-query'

import { MenuView } from '@/features/menus/components/menu-detail/MenuView'
import { menuDetailsQueryOptions } from '@/features/menus'

export const MenuDetailsPage = ({ menuId }: { menuId: string }) => {
  const { data: menu } = useSuspenseQuery(menuDetailsQueryOptions(menuId))
  return <MenuView menu={menu} />
}
