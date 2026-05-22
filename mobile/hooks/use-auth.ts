import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/api/auth.service';
import {
  API_BASE_URL,
  API_BASE_URL_DIAGNOSTICS,
  getApiBaseUrlCandidates,
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
  const status = err?.response?.status;
  const timeoutError = err?.code === 'ECONNABORTED';
  const networkError =
    err?.message === 'Network Error' ||
    err?.code === 'ERR_NETWORK' ||
    !err?.response;
  const candidateHint = getApiBaseUrlCandidates().join(' , ');
  const lanOnlyApiHint = API_BASE_URL_DIAGNOSTICS.isLanOnlyHost
    ? `API hien tai la ${API_BASE_URL} va chi reachable khi dien thoai cung Wi-Fi/LAN voi may chay backend. App da thu cac dia chi: ${candidateHint}. Neu backend dang chay tren may khac, them no vao EXPO_PUBLIC_API_URL hoac EXPO_PUBLIC_API_URL_CANDIDATES.`
    : null;

  if (timeoutError) {
    return lanOnlyApiHint
      ? `Ket noi may chu qua thoi gian cho. ${lanOnlyApiHint} Neu bat buoc dung Expo tunnel, hay chay npm run start:tunnel trong mobile.`
      : `Ket noi may chu qua thoi gian cho. Kiem tra backend va EXPO_PUBLIC_API_URL (${API_BASE_URL}).`;
  }

  if (networkError) {
    return lanOnlyApiHint
      ? `Khong the ket noi may chu tai ${API_BASE_URL}. ${lanOnlyApiHint} Neu bat buoc dung Expo tunnel, hay chay npm run start:tunnel trong mobile.`
      : `Khong the ket noi may chu tai ${API_BASE_URL}. App da thu cac dia chi: ${candidateHint}. Neu dang chay Expo tunnel, hay dung npm run start:tunnel hoac EXPO_PUBLIC_API_URL tro toi backend reachable.`;
  }

  if (status === 502 || status === 503 || status === 504) {
    return `May chu/tunnel tam thoi khong san sang (${status}). App da tu thu lai mot vai lan nhung van chua thong. Thu login lai sau 2-3 giay; neu van lap lai, restart npm run start:tunnel de mo public API URL moi.`;
  }

  return 'Loi ket noi may chu';
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
              error: response?.message || 'So dien thoai hoac mat khau khong dung',
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
          console.error('Login error:', err);

          set({
            error: err?.response?.data?.message || buildNetworkErrorMessage(err),
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
  useAuth.setState({ token: null, user: null, error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
});�p lại.' });
});
