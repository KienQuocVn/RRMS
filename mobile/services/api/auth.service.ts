import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import {
  ChangePasswordByEmailRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/types/auth.types';
import { ApiResponse } from '@/types/common.types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data, {
      rrmsRetryable: true,
      rrmsRetryLabel: 'login',
    } as any);
  },

  logout: async (token: string): Promise<ApiResponse<null>> => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      { token },
      {
        rrmsRetryable: true,
        rrmsRetryLabel: 'logout',
      } as any
    );
  },

  refreshToken: async (token: string): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { token },
      {
        rrmsRetryable: true,
        rrmsRetryLabel: 'refreshToken',
      } as any
    );
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ status: boolean; message: string; username: string }>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  checkMail: async (email: string): Promise<ApiResponse<boolean>> => {
    return apiClient.get(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
      params: { email },
    });
  },

  authenticationRegister: async (gmail: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER_REQUEST_OTP, { gmail });
  },

  acceptAuthenticationRegister: async (gmail: string, code: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER_VERIFY_OTP, { gmail, code });
  },

  forgetPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  acceptChangePassword: async (
    data: ChangePasswordByEmailRequest,
  ): Promise<ApiResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
