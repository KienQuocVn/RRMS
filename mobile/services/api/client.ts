import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { authStorage } from '../storage/auth.storage';

function getExpoLanHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri || typeof hostUri !== 'string') {
    return null;
  }

  return hostUri.split(':')[0] || null;
}

function resolveBaseUrl() {
  const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:7000';
  }

  const expoLanHost = getExpoLanHost();
  if (expoLanHost) {
    return `http://${expoLanHost}:7000`;
  }

  return 'http://localhost:7000';
}

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const BASE_URL = resolveBaseUrl();

if (!configuredApiUrl?.trim()) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is missing. Resolved fallback baseURL in use:',
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
