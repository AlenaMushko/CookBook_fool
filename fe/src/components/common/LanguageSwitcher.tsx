import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

const buttonClassName =
  'flex flex-1 items-center justify-center px-[9px] py-2 font-sans text-[11px] leading-[1.5] font-medium tracking-[0.55px] uppercase transition-colors cursor-pointer'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const isUk = i18n.language.startsWith('uk')

  const setLang = (next: 'en' | 'uk') => {
    if (i18n.language.startsWith(next)) return
    void i18n.changeLanguage(next)
  }

  return (
    <div
      role="group"
      aria-label="Language switch EN / УКР"
      className="inline-flex items-stretch overflow-hidden rounded-md border-[0.75px] border-secondary-border"
    >
      <button
        type="button"
        aria-pressed={!isUk}
        onClick={() => setLang('en')}
        className={cn(
          buttonClassName,
          !isUk
            ? 'bg-secondary text-foreground'
            : 'bg-transparent text-subtle hover:text-foreground focus:text-foreground',
        )}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={isUk}
        onClick={() => setLang('uk')}
        className={cn(
          buttonClassName,
          isUk
            ? 'bg-secondary text-foreground'
            : 'bg-transparent text-subtle hover:text-foreground focus:text-foreground',
        )}
      >
        УКР
      </button>
    </div>
  )
}
