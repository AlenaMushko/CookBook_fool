import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { myMenusQueryOptions } from '@/features/menus'
import emptyMenu from '@/assets/images/empty_menu.webp'

export const MenusPage = () => {
  const { t } = useTranslation()
  const { data } = useSuspenseQuery(myMenusQueryOptions)
  const menus = data.data

  return (
    <div className="-m-5 flex min-h-full flex-col">
      <header className="border-b border-border bg-card px-5 pt-[18px] pb-4 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h1 className="font-serif text-[26px] leading-[39px] font-normal text-foreground">
              {t('menus.title')}
            </h1>
            <p className="text-[13px] leading-5 text-muted-foreground">{t('menus.subtitle')}</p>
          </div>
          <Button
            render={<Link to={Routes.MENU_NEW} />}
            className="h-[38px] min-h-0 w-fit shrink-0 px-[18px] py-[9px] text-[13px]"
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
            {t('menus.create')}
          </Button>
        </div>
      </header>

      {menus.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-6 text-center sm:px-7">
          <img
            src={emptyMenu}
            alt=""
            width={280}
            height={256}
            className="h-auto w-[min(100%,280px)]"
            draggable={false}
          />
          <p className="mt-4 max-w-md text-[14px] leading-6 text-muted-foreground">
            {t('menus.emptyBody')}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 px-5 py-6 sm:grid-cols-2 sm:px-7 xl:grid-cols-3">
          {menus.map((menu) => (
            <li key={menu.id}>
              <Link
                to={Routes.MENU}
                params={{ menuId: menu.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5"
              >
                <div className="grid size-14 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-lg bg-background">
                  {menu.dishCoverPhotoUrls.slice(0, 4).map((photoUrl) => (
                    <img key={photoUrl} src={photoUrl} alt="" className="size-full object-cover" />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-serif text-[16px] leading-5 font-semibold">
                    {menu.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {t('homePage.recipes', { count: menu.dishesCount })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
