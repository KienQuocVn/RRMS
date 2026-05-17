import { safeAsyncStorage } from './safe-async-storage';

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export const authStorage = {
  saveToken: async (token: string) => {
    await safeAsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getToken: async () => {
    return await safeAsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  saveRefreshToken: async (token: string) => {
    await safeAsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getRefreshToken: async () => {
    return await safeAsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  saveUser: async (user: any) => {
    await safeAsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  getUser: async () => {
    const user = await safeAsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return user ? JSON.parse(user) : null;
  },

  clearAll: async () => {
    const keys = [
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ];
    await Promise.all(keys.map((key) => safeAsyncStorage.removeItem(key)));
  },
};
