import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Routes } from '@constants/routes'
import { showToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { menusApi } from '../api/menus.api'
import { readShoppingChecks, writeShoppingChecks } from '../lib/shopping-checks'
import type { ShoppingList, ShoppingListItem } from '../types/shopping-list.types'

const formatQuantity = (value: number) => String(Math.round(value * 1000) / 1000)

const IngredientPhoto = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <img
      src={src}
      alt={alt}
      className="size-9 shrink-0 rounded-lg object-cover"
      onError={() => setFailed(true)}
    />
  )
}

const dishesKeyOf = (list: ShoppingList) =>
  list.dishes
    .map((dish) => dish.id)
    .sort()
    .join('\n')

export const ShoppingListView = ({ list }: { list: ShoppingList }) => {
  const { t, i18n } = useTranslation()
  const dishesKey = dishesKeyOf(list)
  const checksScope = `${list.menuId}\n${dishesKey}`
  const [checksFor, setChecksFor] = useState(checksScope)
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    readShoppingChecks(list.menuId, dishesKey),
  )
  if (checksFor !== checksScope) {
    setChecksFor(checksScope)
    setChecked(readShoppingChecks(list.menuId, dishesKey))
  }
  const [closed, setClosed] = useState<Record<string, boolean>>({})
  const [downloading, setDownloading] = useState(false)
  const uk = i18n.language.startsWith('uk')
  const collator = new Intl.Collator(i18n.language)
  const nameOf = (item: ShoppingListItem) => (uk ? item.nameUk : item.nameEn)
  const amountOf = (item: ShoppingListItem) =>
    `${formatQuantity(item.quantity)} ${uk ? item.symbolUk : item.symbolEn}`
  const meta = [
    t('homePage.recipes', { count: list.dishesCount }),
    t('menus.shopping.items', { count: list.itemsCount }),
    list.servings == null ? null : t('menus.shopping.people', { count: list.servings }),
  ]
    .filter(Boolean)
    .join(' · ')
  const servingsDiffer =
    list.servings == null && list.dishes.some((dish) => dish.servings != null)
  const showOccasion =
    Boolean(list.occasion) &&
    list.occasion?.trim().toLowerCase() !== list.name.trim().toLowerCase()

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    if (!next[id]) delete next[id]
    setChecked(next)
    writeShoppingChecks(list.menuId, dishesKey, next)
  }

  const download = async () => {
    setDownloading(true)
    try {
      await menusApi.downloadShoppingPdf(list.menuId, i18n.language, list.name)
    } catch {
      showToast(t('menus.shopping.downloadFailed'), 'error')
    } finally {
      setDownloading(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast(t('menus.shopping.copied'), 'success')
    } catch {
      showToast(t('menus.shopping.copyFailed'), 'error')
    }
  }

  return (
    <div className="-m-5 min-h-full px-5 pt-6 pb-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <Link
          to={Routes.MENUS}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] text-primary hover:text-primary-hover"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          {t('menus.title')}
        </Link>

        <header className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-[32px] leading-10 font-normal text-foreground italic">
              {t('menus.shopping.title')}
            </h1>
            <p className="mt-1 font-serif text-[20px] leading-7 text-foreground">{list.name}</p>
            {showOccasion ? (
              <p className="mt-0.5 text-[13px] leading-5 text-subtle">{list.occasion}</p>
            ) : null}
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{meta}</p>
            {servingsDiffer ? (
              <p className="mt-1 text-[13px] leading-5 text-subtle">
                {t('menus.shopping.servingsDiffer')}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            isLoading={downloading}
            loadingText={t('menus.shopping.downloading')}
            onClick={download}
            className="h-10 self-start rounded-full px-5 text-[13px]"
          >
            {t('menus.shopping.download')}
          </Button>
        </header>

        <aside className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-5 text-muted-foreground">
            {t('menus.shopping.share')}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0 self-start rounded-full px-4 text-[13px] sm:self-center"
            onClick={copyLink}
          >
            {t('menus.shopping.copyLink')}
          </Button>
        </aside>

        {list.dishes.length === 0 ? (
          <p className="mt-6 text-[14px] text-muted-foreground">{t('menus.shopping.noDishes')}</p>
        ) : (
          <section className="mt-6">
            <h2 className="text-[14px] font-medium text-foreground">
              {t('menus.shopping.dishes')}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {list.dishes.map((dish) => (
                <li
                  key={dish.id}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-[13px] leading-5 text-foreground"
                >
                  {dish.title}
                  {list.servings == null && dish.servings != null
                    ? ` · ${t('menus.shopping.servings', { count: dish.servings })}`
                    : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {list.dishes.length > 0 && list.groups.length === 0 ? (
          <p className="mt-6 text-[14px] text-muted-foreground">{t('menus.shopping.empty')}</p>
        ) : null}

        {list.groups.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-3">
            {list.groups.map((group) => {
              const isClosed = closed[group.id] === true
              const items = [...group.items].sort((left, right) =>
                collator.compare(nameOf(left), nameOf(right)),
              )
              return (
                <li key={group.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
                    aria-expanded={!isClosed}
                    onClick={() =>
                      setClosed((current) => ({
                        ...current,
                        [group.id]: !current[group.id],
                      }))
                    }
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-5 font-medium text-foreground">
                        {t(`menus.shopping.aisles.${group.id}`)}
                      </span>
                      <span className="block text-[12px] leading-4 text-subtle">
                        {t('menus.shopping.items', { count: items.length })}
                      </span>
                    </span>
                    <ChevronUp
                      className={cn(
                        'size-4 shrink-0 text-subtle transition-transform',
                        isClosed && 'rotate-180',
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                  {isClosed ? null : (
                    <ul className="border-t border-border px-2 py-1">
                      {items.map((item) => {
                        const done = checked[item.id] === true
                        const name = nameOf(item)
                        return (
                          <li key={item.id}>
                            <div
                              role="checkbox"
                              aria-checked={done}
                              tabIndex={0}
                              className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-primary/5"
                              onClick={() => toggle(item.id)}
                              onKeyDown={(event) => {
                                if (event.key !== ' ' && event.key !== 'Enter') return
                                event.preventDefault()
                                toggle(item.id)
                              }}
                            >
                              <Checkbox
                                checked={done}
                                tabIndex={-1}
                                aria-hidden
                                className="pointer-events-none"
                              />
                              {item.image ? <IngredientPhoto src={item.image} alt="" /> : null}
                              <span
                                className={cn(
                                  'min-w-0 flex-1 text-[14px] leading-5 text-foreground',
                                  done && 'text-subtle line-through',
                                )}
                              >
                                {name}
                              </span>
                              <span className="shrink-0 text-[13px] text-muted-foreground tabular-nums">
                                {amountOf(item)}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
