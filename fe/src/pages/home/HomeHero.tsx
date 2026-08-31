import { useTranslation } from 'react-i18next'

import heroMobile1x from '@/assets/images/cookbook-hero-mobile@1x.webp'
import heroMobile2x from '@/assets/images/cookbook-hero-mobile@2x.webp'
import heroMobile3x from '@/assets/images/cookbook-hero-mobile@3x.webp'
import heroTablet1x from '@/assets/images/cookbook-hero-tablet@1x.webp'
import heroTablet2x from '@/assets/images/cookbook-hero-tablet@2x.webp'
import heroTablet3x from '@/assets/images/cookbook-hero-tablet@3x.webp'
import heroDesktop1x from '@/assets/images/cookbook-hero-desktop@1x.webp'
import heroDesktop2x from '@/assets/images/cookbook-hero-desktop@2x.webp'
import heroDesktop3x from '@/assets/images/cookbook-hero-desktop@3x.webp'

import './home-hero.css'

function toImageSet(urls: { x1: string; x2: string; x3: string }) {
  return `image-set(url("${urls.x1}") 1x, url("${urls.x2}") 2x, url("${urls.x3}") 3x)`
}

const heroBackgroundVars = {
  ['--hero-bg-mobile' as string]: toImageSet({
    x1: heroMobile1x,
    x2: heroMobile2x,
    x3: heroMobile3x,
  }),
  ['--hero-bg-tablet' as string]: toImageSet({
    x1: heroTablet1x,
    x2: heroTablet2x,
    x3: heroTablet3x,
  }),
  ['--hero-bg-desktop' as string]: toImageSet({
    x1: heroDesktop1x,
    x2: heroDesktop2x,
    x3: heroDesktop3x,
  }),
}

export const HomeHero = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-background">
      <div className="home-hero__frame" style={heroBackgroundVars}>
        <div className="home-hero__overlay" aria-hidden="true" />

        <div className="home-hero__content">
          <div className="home-hero__copy motion-safe:animate-[hero-rise_700ms_ease-out_both]">
            <p className="home-hero__eyebrow">{t('hero.eyebrow')}</p>

            <h1 className="home-hero__title">
              <span className="block">{t('hero.titleLine1')}</span>
              <span className="block">{t('hero.titleLine2')}</span>
              <span className="block">{t('hero.titleLine3')}</span>
            </h1>

            <p className="home-hero__description">{t('hero.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
