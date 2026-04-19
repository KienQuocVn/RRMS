import { apiClient } from './client';
import { Profile } from '@/types/profile.types';
import { ApiResponse } from '@/types/common.types';

export const profileService = {
  /**
   * Lấy thông tin cá nhân
   */
  getProfile: async (username: string): Promise<ApiResponse<Profile>> => {
    return apiClient.get('/profile', { params: { username } });
  },

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile: async (data: Partial<Profile>): Promise<ApiResponse<Profile>> => {
    return apiClient.put('/profile', data);
  },

  /**
   * Đổi mật khẩu
   */
  changePassword: async (data: any): Promise<ApiResponse<string>> => {
    return apiClient.put('/profile/change-password', data);
  },
};
