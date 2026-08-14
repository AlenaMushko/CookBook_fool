import { URLS } from "../../../fe/src/constants/url";

export const API_ROUTES = {
  AUTH: {
    SIGN_UP: `${URLS.AUTH}/sign-up`,
    SIGN_IN: `${URLS.AUTH}/sign-in`,
    LOGOUT: `${URLS.AUTH}/logout`,
    REFRESH: `${URLS.AUTH}/refresh`,
    // VALIDATE_TOKEN: "auth/validate-token",
    FORGOT_PASSWORD: `${URLS.AUTH}/forgot-password`,
  },
  USER: {
    GET_USER_BY_ID: (id: string) => `${URLS.USER}/${id}`,
    UPDATE: (id: string) => `${URLS.USER}/${id}`,
  },
  FILE: {
    UPLOAD: `${URLS.s3}/upload-file`,
    DELETE: `${URLS.s3}/delete-file`,
  },
  DISH: {
    GET_DISH_CATEGORIES: `${URLS.DISH}/categories`,
    GET_ALL: URLS.DISH,
    GET_BY_ID: (dishId: string) => `${URLS.DISH}/${dishId}`,
    CREATE: URLS.DISH,
    UPDATE: (dishId: string) => `${URLS.DISH}/${dishId}`,
    DELETE: (dishId: string) => `${URLS.DISH}/${dishId}`,
  },
};
