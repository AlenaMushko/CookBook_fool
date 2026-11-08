import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { MenuListCard } from '@/features/menus/components/MenuListCard'
import { myMenusQueryOptions } from '@/features/menus'

export const MenusPage = () => {
  const { t } = useTranslation()
  const { data } = useSuspenseQuery(myMenusQueryOptions())

  return (
    <div className="-m-5 flex min-h-full flex-col px-5 pt-7 pb-12 sm:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-[32px] leading-[48px] font-normal text-foreground italic">
            {t('menus.title')}
          </h1>
          <p className="text-[13px] leading-5 text-muted-foreground">{t('menus.subtitle')}</p>
        </div>
        <Button
          nativeButton={false}
          render={<Link to={Routes.MENU_NEW} />}
          className="h-[42px] min-h-0 w-fit shrink-0 px-5 text-[13px]"
        >
          <Plus className="size-3.5" strokeWidth={1.5} />
          {t('menus.create')}
        </Button>
      </header>

      <ul className="mt-8 grid gap-[22px] sm:grid-cols-2 xl:grid-cols-3">
        {data.data.map((menu) => (
          <li key={menu.id} className="min-h-[269px]">
            <MenuListCard menu={menu} />
          </li>
        ))}
        <li>
          <Link
            to={Routes.MENU_NEW}
            className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-border bg-card px-6 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
              <Plus className="size-5" strokeWidth={1.5} />
            </span>
            <p className="mt-3 text-[14px] leading-5 text-foreground">{t('menus.newCard')}</p>
            <p className="mt-1 text-[12px] leading-[18px] text-subtle">{t('menus.newCardHint')}</p>
          </Link>
        </li>
      </ul>
    </div>
  )
}
