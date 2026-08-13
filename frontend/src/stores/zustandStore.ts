import { LOCAL_STORAGE } from "@constants/localStorage";
import { LocalStorageUtils } from "@utils/LocalStorage";
import { create } from "zustand";

import type { ToastType } from "@shared/Toast";

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}

interface AppState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  deviceId: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserId: (userId: string) => void;
  setDeviceId: (deviceId: string) => void;
  clearAuth: () => void;

  language: "en" | "uk";
  setLanguage: (language: "en" | "uk") => void;

  toast: ToastState;
  setToast: (toast: ToastState) => void;

  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;

  dishCategory: { id: string; name: string } | null;
  setDishCategory: (dishCategory: { id: string; name: string } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  accessToken: LocalStorageUtils.getItem(LOCAL_STORAGE.ACCESS_TOKEN),
  refreshToken: LocalStorageUtils.getItem(LOCAL_STORAGE.REFRESH_TOKEN),
  userId: LocalStorageUtils.getItem(LOCAL_STORAGE.USER_ID),
  deviceId: LocalStorageUtils.getItem(LOCAL_STORAGE.DEVICE_ID),
  isAuthenticated: !!LocalStorageUtils.getItem(LOCAL_STORAGE.ACCESS_TOKEN),

  setDeviceId: (deviceId: string) => {
    LocalStorageUtils.setItem(LOCAL_STORAGE.DEVICE_ID, deviceId);
    set({ deviceId });
  },

  setTokens: (accessToken, refreshToken) => {
    LocalStorageUtils.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
    LocalStorageUtils.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  setUserId: (userId: string) => {
    LocalStorageUtils.setItem(LOCAL_STORAGE.USER_ID, userId);
    set({ userId });
  },

  clearAuth: () => {
    LocalStorageUtils.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    LocalStorageUtils.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
    LocalStorageUtils.removeItem(LOCAL_STORAGE.USER_ID);
    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
    });
  },

  language: "en",
  setLanguage: (language) => set({ language }),

  toast: {
    open: false,
    message: "",
    type: "info",
  },
  setToast: (toast) => set({ toast }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  dishCategory: null,
  setDishCategory: (dishCategory: { id: string; name: string } | null) =>
    set({ dishCategory: dishCategory }),
}));
