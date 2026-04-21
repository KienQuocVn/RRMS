import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { BackendResponse } from '@/types/common.types';
import { MotelResponse } from '@/types/motel.types';

export const motelService = {
  /**
   * Lấy danh sách nhà trọ
   */
  getAllMotels: async (): Promise<BackendResponse<MotelResponse[]>> => {
    return apiClient.get(API_ENDPOINTS.MOTELS.BASE);
  },

  /**
   * Lấy chi tiết nhà trọ theo ID
   */
  getMotelById: async (id: string): Promise<BackendResponse<MotelResponse>> => {
    return apiClient.get(API_ENDPOINTS.MOTELS.GET_BY_ID(id));
  },

  /**
   * Tạo nhà trọ mới
   */
  createMotel: async (data: any): Promise<BackendResponse<MotelResponse>> => {
    return apiClient.post(API_ENDPOINTS.MOTELS.CREATE, data);
  },
};
