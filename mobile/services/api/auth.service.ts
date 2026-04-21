import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { LoginRequest, LoginResponse } from '@/types/auth.types';
import { BackendResponse } from '@/types/common.types';

export const authService = {
  /**
   * Đăng nhập hệ thống
   */
  login: async (data: LoginRequest): Promise<BackendResponse<LoginResponse>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Đăng xuất
   */
  logout: async (token: string): Promise<BackendResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { token });
  },

  /**
   * Làm mới token
   */
  refreshToken: async (token: string): Promise<BackendResponse<LoginResponse>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token });
  },

  /**
   * Quên mật khẩu - Gửi OTP
   */
  forgetPassword: async (email: string): Promise<BackendResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Xác nhận đổi mật khẩu
   */
  acceptChangePassword: async (data: any): Promise<BackendResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
