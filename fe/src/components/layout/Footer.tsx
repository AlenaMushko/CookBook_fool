import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden w-full border-t-[0.75px] border-secondary-border bg-card px-7 py-5 text-center md:block">
      <p className="type-caption text-accent-foreground">
        © {currentYear} Cookbook. {t('footer.rights')}
      </p>
    </footer>
  )
}
