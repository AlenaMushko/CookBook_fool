import { ApiVersion } from '@constants/api-version'

export const ApiRoutes = {
  auth: {
    signIn: `/${ApiVersion.V1}/auth/sign-in`,
    signUp: `/${ApiVersion.V1}/auth/sign-up`,
    logout: `/${ApiVersion.V1}/auth/logout`,
    refresh: `/${ApiVersion.V1}/auth/refresh`,
    forgotPassword: `/${ApiVersion.V1}/auth/forgot-password`,
    resetPassword: `/${ApiVersion.V1}/auth/reset-password`,
    validateResetPassword: `/${ApiVersion.V1}/auth/reset-password/validate`,
    requestPasswordChange: `/${ApiVersion.V1}/auth/request-password-change`,
  },
  user: {
    me: `/${ApiVersion.V1}/user/me`,
  },
  s3: {
    uploadFile: `/${ApiVersion.V1}/s3/upload-file`,
    deleteFile: `/${ApiVersion.V1}/s3/delete-file`,
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

} as const


