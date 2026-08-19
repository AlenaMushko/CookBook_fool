import { useSuspenseQuery } from '@tanstack/react-query'
import { menuDetailsQueryOptions } from '@/features/menus'

export const MenuDetailsPage = ({ menuId }: { menuId: string }) => {
  const { data: menu } = useSuspenseQuery(menuDetailsQueryOptions(menuId))

  if (!menu) {
    return <p>Menu not found</p>
  }

  return <h1>{menu.title}</h1>
}
