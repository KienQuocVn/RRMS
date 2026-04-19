import axios from 'axios';
import { Platform } from 'react-native';
import { authStorage } from '../storage/auth.storage';

// Cấu hình Base URL linh hoạt cho Android/iOS
// IP 10.0.2.2 là địa chỉ của máy host trong Android Emulator
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

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
    const token = await authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
