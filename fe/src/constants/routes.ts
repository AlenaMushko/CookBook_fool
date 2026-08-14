import type { FileRoutesByTo } from '@/routeTree.gen'

type AppPath = keyof FileRoutesByTo

export const Routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  RECIPES: '/recipes',
  RECIPE: '/recipes/$recipeId',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  MY_COOKBOOK: '/my-cookbook',
  RECIPE_NEW: '/recipes/new',
  RECIPE_EDIT: '/recipes/$recipeId/edit',
  MENUS: '/menus',
  MENU_NEW: '/menus/new',
  MENU: '/menus/$menuId',
  MENU_EDIT: '/menus/$menuId/edit',
} as const satisfies Record<string, AppPath>
