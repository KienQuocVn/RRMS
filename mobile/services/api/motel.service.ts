import { apiClient } from './client';
import { Motel } from '@/types/motel.types';
import { ApiResponse } from '@/types/common.types';

export const motelService = {
  /**
   * Lấy danh sách tất cả các nhà trọ
   */
  getAllMotels: async (): Promise<ApiResponse<Motel[]>> => {
    return apiClient.get('/motels');
  },

  /**
   * Lấy chi tiết nhà trọ theo ID
   */
  getMotelById: async (id: string): Promise<ApiResponse<Motel>> => {
    return apiClient.get('/motels/get-motel-id', { params: { id } });
  },

  /**
   * Lấy danh sách nhà trọ theo username
   */
  getMotelsByAccount: async (username: string): Promise<ApiResponse<Motel[]>> => {
    return apiClient.get('/motels/get-motel-account', { params: { username } });
  },
};
