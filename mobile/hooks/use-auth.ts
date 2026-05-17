import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/api/auth.service';
import { LoginRequest, LoginResponse } from '@/types/auth.types';
import { zustandSafeStorage } from '@/services/storage/safe-async-storage';

interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isLoading: boolean;
  isHydrated: boolean; // Trạng thái đã load dữ liệu từ storage xong chưa
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  setHydrated: () => void;
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
          // Theo cấu trúc Backend: { code, message, result }
          // Lưu ý: authService.login trả về BackendResponse (status, message, data) 
          // do apiClient đã intercept dữ liệu
          
          if (response && response.result) {
            const { token } = response.result;
            set({ 
              token, 
              user: response.result, 
              isLoading: false,
              error: null 
            });
            return true;
          } else {
            set({ 
              error: response.message || 'Số điện thoại hoặc mật khẩu không đúng', 
              isLoading: false 
            });
            return false;
          }
        } catch (err: any) {
          console.error('Login error:', err);
          const timeoutError = err?.code === 'ECONNABORTED';
          const networkError = err?.message === 'Network Error';
          set({ 
            error:
              err.response?.data?.message ||
              (timeoutError
                ? 'Kết nối máy chủ quá thời gian chờ. Kiểm tra EXPO_PUBLIC_API_URL và mạng nội bộ.'
                : networkError
                ? 'Không thể kết nối máy chủ. Kiểm tra backend đang chạy và thiết bị cùng mạng.'
                : 'Lỗi kết nối máy chủ'),
            isLoading: false 
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
          set({ token: null, user: null, isLoading: false, error: null });
        }
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
