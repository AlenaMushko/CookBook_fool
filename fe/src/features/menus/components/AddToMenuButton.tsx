import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiError } from '@api/client'
import { ListPagination } from '@components/common/ListPagination'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/ui/tooltip'
import { Routes } from '@constants/routes'
import { useAuthSession } from '@/hooks/useAuthSession'
import { showToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { menusApi } from '../api/menus.api'
import {
  forgetShoppingList,
  menuDetailsQueryOptions,
  menuQueryKeys,
} from '../api/menus.queries'

const stageSlotClass = 'h-[70px]'
const MENU_PAGE_SIZE = 9

export const AddToMenuButton = ({
  dishId,
  appearance = 'icon',
  className,
}: {
  dishId: string
  appearance?: 'icon' | 'label'
  className?: string
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthSession()
  const [open, setOpen] = useState(false)

  const openDialog = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      void navigate({ to: Routes.LOGIN })
      return
    }
    setOpen(true)
  }

  const trigger =
    appearance === 'label' ? (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              onClick={openDialog}
              className={cn('h-8 min-h-0 px-3 text-[12px]', className)}
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
              {t('homePage.addToMenu')}
            </Button>
          }
        />
        <TooltipContent side="top">{t('menus.addDish.title')}</TooltipContent>
      </Tooltip>
    ) : (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={t('menus.addDish.title')}
              onClick={openDialog}
              className={cn(
                'flex size-8 cursor-pointer items-center justify-center rounded-lg bg-card/95 text-foreground shadow-[0_1px_2px_rgba(43,38,32,0.12)] transition-colors duration-200 ease-smooth hover:bg-card hover:text-brand',
                className,
              )}
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </button>
          }
        />
        <TooltipContent side="bottom">{t('menus.addDish.title')}</TooltipContent>
      </Tooltip>
    )

  return (
    <>
      {trigger}
      {open ? (
        <AddToMenuDialog
          dishId={dishId}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  )
}

const AddToMenuDialog = ({
  dishId,
  open,
  onOpenChange,
}: {
  dishId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [sectionId, setSectionId] = useState<string | null>(null)

  const menusQuery = useQuery({
    queryKey: [...menuQueryKeys.lists(), 'picker', dishId, page, MENU_PAGE_SIZE],
    queryFn: () =>
      menusApi.listMine({
        limit: MENU_PAGE_SIZE,
        offset: (page - 1) * MENU_PAGE_SIZE,
        excludeDishId: dishId,
      }),
    enabled: open,
    staleTime: 0,
  })
  const detailQuery = useQuery({
    ...menuDetailsQueryOptions(menuId ?? 'none'),
    enabled: open && Boolean(menuId),
  })

  const menus = menusQuery.data?.data ?? []
  const total = menusQuery.data?.meta.total ?? 0
  const menusTotal = menusQuery.data?.meta.menusTotal ?? 0
  const pageCount = Math.max(1, Math.ceil(total / MENU_PAGE_SIZE))
  const waitingForMenus = menusQuery.isPending
  if (menusQuery.data && page > pageCount) setPage(pageCount)
  const sections = [...(detailQuery.data?.sections ?? [])].sort(
    (a, b) => a.order - b.order,
  )
  const waitingForStages = Boolean(menuId) && detailQuery.isFetching
  const needsStage = !waitingForStages && sections.length > 0
  const canSave = Boolean(menuId) && !waitingForStages && (!needsStage || Boolean(sectionId))

  const close = () => {
    setPage(1)
    setMenuId(null)
    setSectionId(null)
    onOpenChange(false)
  }

  const showPage = (next: number) => {
    setPage(next)
    setMenuId(null)
    setSectionId(null)
  }

  const save = useMutation({
    meta: { skipGlobalLoader: true },
    mutationFn: () => {
      if (!menuId) throw new Error('menu')
      return menusApi.addDishes(menuId, [dishId], needsStage ? sectionId : null)
    },
    onSuccess: async () => {
      if (menuId) {
        forgetShoppingList(queryClient, menuId)
        await queryClient.invalidateQueries({ queryKey: menuQueryKeys.detail(menuId) })
      }
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() })
      showToast(t('menus.addDish.added'), 'success')
      close()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'MENU_DISH_ALREADY_ADDED') {
        showToast(t('menus.addDish.already'), 'warning')
        return
      }
      showToast(t('menus.addDish.failed'), 'error')
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('menus.addDish.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-1.5" role="group" aria-labelledby="add-to-menu-menus">
            <span id="add-to-menu-menus" className="text-[13px] leading-5 font-medium">
              {t('menus.addDish.menu')}
            </span>
            {waitingForMenus ? (
              <p className="text-[13px] leading-5 text-muted-foreground">
                {t('menus.addDish.menuPlaceholder')}
              </p>
            ) : null}
            {menusQuery.isError ? (
              <p className="text-[13px] leading-5 text-destructive">{t('error.serverError')}</p>
            ) : null}
            {!waitingForMenus && !menusQuery.isError && menus.length === 0 ? (
              <p className="text-[13px] leading-5 text-muted-foreground">
                {menusTotal === 0
                  ? t('menus.addDish.noMenus')
                  : t('menus.addDish.alreadyInAll')}
              </p>
            ) : null}
            {menus.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {menus.map((menu) => {
                  const selected = menuId === menu.id
                  return (
                    <li key={menu.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        disabled={save.isPending}
                        onClick={() => {
                          setMenuId(menu.id)
                          setSectionId(null)
                        }}
                        className={cn(
                          'w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-[14px] leading-5',
                          selected
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary',
                        )}
                      >
                        {menu.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
            <ListPagination
              page={page}
              pageCount={pageCount}
              onPageChange={showPage}
              className="mt-3"
              label={t('menus.addDish.pages')}
            />
          </div>
          <div className={stageSlotClass} aria-hidden={!needsStage}>
            {needsStage ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] leading-5 font-medium">
                  {t('menus.addDish.stage')}
                </span>
                <Select
                  value={sectionId}
                  items={sections.map((section) => ({
                    value: section.id,
                    label: section.name,
                  }))}
                  onValueChange={setSectionId}
                  disabled={save.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('menus.addDish.stagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            size="modal"
            disabled={save.isPending}
            onClick={close}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            size="modal"
            isLoading={save.isPending}
            disabled={!canSave}
            onClick={() => save.mutate()}
          >
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
