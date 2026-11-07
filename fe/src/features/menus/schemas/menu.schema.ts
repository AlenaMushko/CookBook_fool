import type { TFunction } from 'i18next'
import { z } from 'zod'

export const MENU_NAME_MAX = 80
export const MENU_DESCRIPTION_MAX = 400
export const MENU_OCCASION_MAX = 32

export const createMenuSchema = (t: TFunction, mode: 'publish' | 'draft' = 'publish') => {
  const name = z.string().trim().max(MENU_NAME_MAX, {
    message: t('menus.createPage.nameLength', { count: MENU_NAME_MAX }),
  })

  return z.object({
    name:
      mode === 'draft'
        ? name
        : name.min(1, { message: t('menus.createPage.nameRequired') }),
    description: z
      .string()
      .trim()
      .max(MENU_DESCRIPTION_MAX, {
        message: t('menus.createPage.descriptionLength', { count: MENU_DESCRIPTION_MAX }),
      }),
    occasion: z
      .string()
      .trim()
      .max(MENU_OCCASION_MAX, {
        message: t('menus.createPage.occasionLength', { count: MENU_OCCASION_MAX }),
      }),
  })
}

export type CreateMenuValues = z.infer<ReturnType<typeof createMenuSchema>>
