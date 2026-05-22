import { ApiResponse } from '@/types/common.types';
import {
  CreateMotelServicePayload,
  MotelServiceItem,
  UpdateMotelServicePayload,
} from '@/types/service-settings.types';

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const motelManagementService = {
  getAllMotelServices: async (): Promise<ApiResponse<MotelServiceItem[]>> => {
    return apiClient.get(API_ENDPOINTS.MOTEL_SERVICES.BASE);
  },

  createMotelService: async (
    payload: CreateMotelServicePayload,
  ): Promise<ApiResponse<MotelServiceItem>> => {
    return apiClient.post(API_ENDPOINTS.MOTEL_SERVICES.BASE, payload);
  },

  getMotelServiceById: async (motelServiceId: string): Promise<ApiResponse<MotelServiceItem>> => {
    return apiClient.get(API_ENDPOINTS.MOTEL_SERVICES.BY_ID(motelServiceId));
  },

  updateMotelService: async (
    motelServiceId: string,
    payload: UpdateMotelServicePayload,
  ): Promise<ApiResponse<MotelServiceItem>> => {
    return apiClient.put(API_ENDPOINTS.MOTEL_SERVICES.BY_ID(motelServiceId), payload);
  },

  deleteMotelService: async (motelServiceId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(API_ENDPOINTS.MOTEL_SERVICES.BY_ID(motelServiceId));
  },
};
