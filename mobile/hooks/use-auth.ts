import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/api/auth.service';
import {
  buildApiErrorMessage,
  registerUnauthorizedListener,
} from '@/services/api/client';
import { authStorage } from '@/services/storage/auth.storage';
import { LoginRequest, LoginResponse } from '@/types/auth.types';
import { zustandSafeStorage } from '@/services/storage/safe-async-storage';

interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<LoginResponse>) => Promise<void>;
  setHydrated: () => void;
}

function normalizeUser(user: LoginResponse): LoginResponse {
  return {
    ...user,
    fullName: user.fullName ?? user.fullname ?? user.username,
    fullname: user.fullname ?? user.fullName ?? user.username,
    roles: user.roles ?? [],
  };
}

function buildNetworkErrorMessage(err: any) {
  return buildApiErrorMessage(err);
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isHydrated: false,
      error: null,

      setHydrated: () => set({ isHydrated: true }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          if (!response?.result?.token) {
            set({
              error: response?.message || 'Số điện thoại hoặc mật khẩu không đúng.',
              isLoading: false,
            });
            return false;
          }

          const user = normalizeUser(response.result);
          const { token } = user;

          await authStorage.saveToken(token);
          await authStorage.saveUser(user);

          set({
            token,
            user,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (err: any) {
          if (err?.response?.status === 401) {
            console.warn('Login failed: invalid phone or password');
          } else {
            console.error('Login error:', {
              status: err?.response?.status,
              data: err?.response?.data,
              message: err?.message,
            });
          }

          set({
            error: buildNetworkErrorMessage(err),
            isLoading: false,
          });

          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          const token = get().token;
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

      updateUserProfile: async (profile) => {
        const currentUser = get().user;
        if (!currentUser) {
          return;
        }

        const nextUser = normalizeUser({
          ...currentUser,
          ...profile,
          roles: profile.roles ?? currentUser.roles,
        });

        await authStorage.saveUser(nextUser);
        set({ user: nextUser });
      },
    }),
    {
      name: 'rrms-auth-storage',
      storage: createJSONStorage(() => zustandSafeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

registerUnauthorizedListener(() => {
  useAuth.setState({
    token: null,
    user: null,
    error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  });
});
