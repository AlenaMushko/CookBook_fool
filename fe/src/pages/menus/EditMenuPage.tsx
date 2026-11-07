import { useSuspenseQuery } from '@tanstack/react-query'

import { MenuEditor } from '@/features/menus/components/menu-detail/MenuEditor'
import { menuDetailsQueryOptions } from '@/features/menus'

export const EditMenuPage = ({ menuId }: { menuId: string }) => {
  const { data: menu } = useSuspenseQuery(menuDetailsQueryOptions(menuId))
  return <MenuEditor key={menu.id} menu={menu} />
}
