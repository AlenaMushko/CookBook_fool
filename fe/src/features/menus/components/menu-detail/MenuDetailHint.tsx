import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const MenuDetailHint = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-secondary px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-foreground">{t('menus.detail.hintTitle')}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{t('menus.detail.hintBody')}</p>
      </div>
      <button
        type="button"
        className="cursor-pointer text-subtle hover:text-foreground"
        aria-label={t('menus.detail.dismissHint')}
        onClick={onClose}
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
