import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Routes } from '@constants/routes'
import { CreateMenuForm } from '@/features/menus/components/CreateMenuForm'

export const CreateMenuPage = () => {
  const { t } = useTranslation()

  return (
    <div className="-m-5 flex min-h-full flex-col px-5 py-6 sm:px-7">
      <Link
        to={Routes.MENUS}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        {t('menus.createPage.back')}
      </Link>
      <h1 className="mt-3 font-serif text-[32px] leading-10 font-normal text-foreground">
        {t('menus.createPage.title')}
      </h1>
      <p className="mt-1 text-[14px] leading-5 text-muted-foreground">
        {t('menus.createPage.subtitle')}
      </p>
      <CreateMenuForm />
    </div>
  )
}
