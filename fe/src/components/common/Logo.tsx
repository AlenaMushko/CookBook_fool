import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { URLS } from '@constants/url'

export const Logo = () => {
    const { t } = useTranslation()

    return (
        <Link
            to={URLS.HOME}
            aria-label={t('logo.home')}
            className="font-serif text-[19px] leading-[1.1] font-normal text-brand italic hover:text-primary-hover focus-visible:text-primary-hover"
      >
        Cookbook
      </Link>
    );
  };