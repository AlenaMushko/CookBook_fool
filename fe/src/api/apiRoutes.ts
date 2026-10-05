import { ApiVersion } from '@constants/api-version'

export const ApiRoutes = {
  auth: {
    signIn: `/${ApiVersion.V1}/auth/sign-in`,
    signUp: `/${ApiVersion.V1}/auth/sign-up`,
    logout: `/${ApiVersion.V1}/auth/logout`,
    refresh: `/${ApiVersion.V1}/auth/refresh`,
    forgotPassword: `/${ApiVersion.V1}/auth/forgot-password`,
    resetPassword: `/${ApiVersion.V1}/auth/reset-password`,
    //   currentUser: '/api/auth/me',
  },

   // menus: {
    //   all: '/api/menus',
  
    //   byId: (menuId: string) =>
    //     `/api/menus/${menuId}`,
    // },
  
    // recipes: {
    //   all: '/api/recipes',
  
    //   my: '/api/recipes/my',
  
    //   byId: (recipeId: string) =>
    //     `/api/recipes/${recipeId}`,
    // },
  
    // users: {
    //   profile: '/api/users/profile',
    //   changePassword: '/api/users/change-password',
    // },
} as const


