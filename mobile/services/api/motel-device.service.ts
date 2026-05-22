import { ApiResponse } from '@/types/common.types';
import { apiClient } from './client';

export interface MotelDeviceItem {
  motel_device_id: string;
  deviceName: string;
  icon: string;
  value: number;
  valueInput: number;
  totalQuantity: number;
  totalUsing: number;
  totalNull: number;
  supplier: string;
  unit: string;
  motel?: {
    motelId: string;
    motelName: string;
  };
}

export interface CreateMotelDevicePayload {
  motel: {
    motelId: string;
  };
  deviceName: string;
  icon: string;
  value: number;
  valueInput: number;
  totalQuantity: number;
  totalUsing: number;
  totalNull: number;
  supplier: string;
  unit: string;
}

export const motelDeviceService = {
  getDevicesByMotel: async (motelId: string): Promise<ApiResponse<MotelDeviceItem[]>> => {
    return apiClient.get(`/api/v1/motel-devices/motel/${motelId}`);
  },

  insertDevice: async (payload: CreateMotelDevicePayload): Promise<ApiResponse<MotelDeviceItem>> => {
    return apiClient.post('/api/v1/motel-devices', payload);
  },

  deleteDevice: async (deviceId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/v1/motel-devices/${deviceId}`);
  },
};
