import axios from 'axios';
import { Platform } from 'react-native';
import { authStorage } from '../storage/auth.storage';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const fallbackApiUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:7000' : 'http://localhost:7000';
const BASE_URL = configuredApiUrl?.trim() || fallbackApiUrl;

if (!configuredApiUrl?.trim()) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is missing. Fallback baseURL in use:',
    BASE_URL
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Tự động chèn Bearer Token vào Header
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Không đính kèm token vào các request xác thực (login, register...)
    const isAuthUrl = config.url?.includes('/authen/');
    
    if (!isAuthUrl) {
      const token = await authStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Xử lý dữ liệu trả về và lỗi hệ thống
 */
apiClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu trực tiếp từ backend
    return response.data;
  },
  async (error) => {
    // Xử lý lỗi 401 Unauthorized toàn cục
    if (error.response?.status === 401) {
      await authStorage.clearAll();
      // Quá trình điều hướng sẽ được store xử lý khi nhận thấy token biến mất
    }
    return Promise.reject(error);
  }
);
