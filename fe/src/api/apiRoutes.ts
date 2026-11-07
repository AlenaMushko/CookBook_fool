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
  feedback: `/${ApiVersion.V1}/feedback`,
  s3: {
    uploadFile: `/${ApiVersion.V1}/s3/upload-file`,
    deleteFile: `/${ApiVersion.V1}/s3/delete-file`,
  },
  dish: {
    all: `/${ApiVersion.V1}/dish`,
    categories: `/${ApiVersion.V1}/dish/categories`,
    byId: (dishId: string) => `/${ApiVersion.V1}/dish/${dishId}`,
  },
  ingredients: {
    search: `/${ApiVersion.V1}/ingredients`,
  },
  measurementUnits: {
    list: `/${ApiVersion.V1}/measurement-units`,
  },
  menu: {
    all: `/${ApiVersion.V1}/menu`,
    byId: (menuId: string) => `/${ApiVersion.V1}/menu/${menuId}`,
    dishes: (menuId: string) => `/${ApiVersion.V1}/menu/${menuId}/dishes`,
    dish: (menuId: string, dishId: string) =>
      `/${ApiVersion.V1}/menu/${menuId}/dishes/${dishId}`,
    sections: (menuId: string) => `/${ApiVersion.V1}/menu/${menuId}/sections`,
    section: (menuId: string, sectionId: string) =>
      `/${ApiVersion.V1}/menu/${menuId}/sections/${sectionId}`,
  },

   // menus: {
    //   byId: (menuId: string) =>
    //     `/api/menus/${menuId}`,
    // },

} as const


