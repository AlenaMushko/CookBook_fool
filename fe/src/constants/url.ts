import { CONFIG } from '@config'

export const API_URL = CONFIG.API_URL

export const URLS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH: '/auth',
  USER: '/user',
  RECIPES: '/recipes',
  MENUS: '/menus',
  RECIPE_NEW: '/recipes/new',
  NOT_FOUND: '/not-found',
  ERROR: '/error',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
}
