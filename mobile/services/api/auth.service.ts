import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';
import { ApiResponse } from '@/types/common.types';

export const authService = {
  /**
   * Đăng nhập hệ thống
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Đăng xuất
   */
  logout: async (token: string): Promise<ApiResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { token });
  },

  /**
   * Làm mới token
   */
  refreshToken: async (token: string): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token });
  },

  /**
   * Đăng ký
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Gửi OTP xác thực khi đăng ký
   */
  authenticationRegister: async (gmail: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post('/authen/authenticationRegister', { gmail });
  },

  /**
   * Xác nhận OTP đăng ký
   */
  acceptAuthenticationRegister: async (gmail: string, code: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post('/authen/acceptAuthenticationRegister', { gmail, code });
  },

  /**
   * Quên mật khẩu - Gửi OTP
   */
  forgetPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Xác nhận đổi mật khẩu
   */
  acceptChangePassword: async (data: any): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
