import {
  BookOpen,
  CirclePlus,
  Home,
  LayoutList,
  type LucideIcon,
} from 'lucide-react'

import { Routes } from '@constants/routes'

export type AppNavItem = {
  to: string
  labelKey: string
  icon: LucideIcon
  exact?: boolean
  requiresAuth?: boolean
}

/** Tablet / desktop sidebar — same icons as mobile bottom nav, plus Home. */
export const desktopNavItems: AppNavItem[] = [
  { to: Routes.HOME, labelKey: 'nav.home', icon: Home, exact: true },
  { to: Routes.RECIPES, labelKey: 'nav.recipes', icon: BookOpen, exact: true },
  { to: Routes.MENUS, labelKey: 'nav.myMenus', icon: LayoutList, requiresAuth: true },
  {
    to: Routes.RECIPE_NEW,
    labelKey: 'nav.createRecipeDesktop',
    icon: CirclePlus,
    exact: true,
    requiresAuth: true,
  },
]

/** Mobile bottom bar — icons only (no Home; Home is the logo / landing). */
export const mobileNavItems: AppNavItem[] = [
  { to: Routes.RECIPES, labelKey: 'nav.recipes', icon: BookOpen, exact: true },
  { to: Routes.MENUS, labelKey: 'nav.myMenus', icon: LayoutList, requiresAuth: true },
  {
    to: Routes.RECIPE_NEW,
    labelKey: 'nav.createRecipe',
    icon: CirclePlus,
    exact: true,
    requiresAuth: true,
  },
]

export function isPathActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}
