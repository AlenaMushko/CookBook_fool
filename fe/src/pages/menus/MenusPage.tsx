import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { myMenusQueryOptions } from '@/features/menus'

export const MenusPage = () => {
  const { data: menus } = useSuspenseQuery(myMenusQueryOptions)

  return (
    <main className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Menus</h1>
        <Link to="/menus/new">Create menu</Link>
      </header>

      {menus.length === 0 ? (
        <p>You do not have any menus yet.</p>
      ) : (
        <div className="space-y-2">
          {menus.map((menu) => (
            <p key={menu.id}>{menu.title}</p>
          ))}
        </div>
      )}
    </main>
  )
}
