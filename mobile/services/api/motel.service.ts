import { ApiResponse } from '@/types/common.types';
import { MotelResponse } from '@/types/motel.types';

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const motelService = {
  getAllMotels: async (): Promise<ApiResponse<MotelResponse[]>> => {
    return apiClient.get(API_ENDPOINTS.MOTELS.BASE);
  },

  getMotelById: async (id: string): Promise<ApiResponse<MotelResponse>> => {
    return apiClient.get(API_ENDPOINTS.MOTELS.GET_BY_ID(id));
  },

  getMotelsByAccount: async (username: string): Promise<ApiResponse<MotelResponse[]>> => {
    return apiClient.get(API_ENDPOINTS.MOTELS.GET_BY_ACCOUNT(username));
  },

  createMotel: async (data: any): Promise<ApiResponse<MotelResponse>> => {
    return apiClient.post(API_ENDPOINTS.MOTELS.CREATE, data);
  },
};
