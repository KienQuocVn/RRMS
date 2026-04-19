import { create } from 'zustand';
import { authService } from '@/services/api/auth.service';
import { authStorage } from '@/services/storage/auth.storage';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

interface AuthStore {
  token: string | null;
  user: LoginResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  initialize: async () => {
    const token = await authStorage.getToken();
    const user = await authStorage.getUser();
    if (token && user) {
      set({ token, user, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      if (response.status && response.data) {
        const { token } = response.data;
        await authStorage.saveToken(token);
        await authStorage.saveUser(response.data);
        set({ token, user: response.data, isLoading: false });
      } else {
        set({ error: response.message || 'Đăng nhập thất bại', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Lỗi kết nối máy chủ', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const token = await authStorage.getToken();
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.log('Logout error (silent):', err);
    } finally {
      await authStorage.clearAll();
      set({ token: null, user: null, isLoading: false, error: null });
    }
  },
}));
