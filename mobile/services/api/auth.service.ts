import { apiClient } from './client';
import { LoginRequest, LoginResponse } from '@/types/auth.types';
import { BackendResponse } from '@/types/common.types';

export const authService = {
  /**
   * Đăng nhập hệ thống
   */
  login: async (data: LoginRequest): Promise<BackendResponse<LoginResponse>> => {
    return apiClient.post('/authen/login', data);
  },

  /**
   * Đăng xuất
   */
  logout: async (token: string): Promise<BackendResponse<any>> => {
    return apiClient.post('/authen/logout', { token });
  },

  /**
   * Làm mới token
   */
  refreshToken: async (token: string): Promise<BackendResponse<LoginResponse>> => {
    return apiClient.post('/authen/refreshToken', { token });
  },
};
