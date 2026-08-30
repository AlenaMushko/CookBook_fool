import { useTranslation } from 'react-i18next'

import { URLS } from '@constants/url'
import { Logo } from '@components/common/Logo'
import { LanguageSwitcher } from '@components/common/LanguageSwitcher'
import { NavButtonLink } from '@components/layout/NavButtonLink'
export const Header = () => {
  const { t } = useTranslation()

  return (
    <nav className="flex items-center justify-between gap-4 border-b-[0.75px] border-secondary-border bg-card px-7 py-2.5">
    <Logo />
    <ul className="flex items-center gap-2">
      <li>
        <LanguageSwitcher />
      </li>
      <li>
        <NavButtonLink to={URLS.LOGIN} text={t('login')} />
      </li>
      <li className="max-[480px]:hidden">
        <NavButtonLink to={URLS.REGISTER} text={t('signup')} />
      </li>
    </ul>
  </nav>
  )
}
