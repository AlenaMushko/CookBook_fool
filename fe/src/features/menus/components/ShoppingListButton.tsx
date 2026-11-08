import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Routes } from '@constants/routes'
import { cn } from '@/lib/utils'

export const ShoppingListButton = ({
  menuId,
  className,
}: {
  menuId: string
  className?: string
}) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={<Link to={Routes.MENU_SHOPPING} params={{ menuId }} />}
      className={cn('w-fit shrink-0', className)}
    >
      <ShoppingCart className="size-3.5" strokeWidth={1.5} />
      {t('menus.shopping.open')}
    </Button>
  )
}
