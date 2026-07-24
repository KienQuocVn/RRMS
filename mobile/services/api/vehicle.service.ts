/**
 * vehicle.service.ts - Dịch vụ quản lý phương tiện (xe)
 * Tương tác với endpoint /cars của backend
 */

import { apiClient } from './client';
import { VehicleRequest, VehicleResponse } from '@/types/vehicle.types';
import { ApiResponse } from '@/types/common.types';

export const vehicleService = {
  /**
   * Lấy toàn bộ phương tiện theo nhà trọ
   */
  getVehiclesByMotel: async (motelId: string): Promise<ApiResponse<VehicleResponse[]>> => {
    return apiClient.get(`/cars/motel/${motelId}`);
  },

  /**
   * Lấy phương tiện theo phòng
   */
  getVehiclesByRoom: async (roomId: string): Promise<ApiResponse<VehicleResponse[]>> => {
    return apiClient.get(`/cars/room/${roomId}`);
  },

  /**
   * Lấy phương tiện theo ID
   */
  getVehicleById: async (carId: string): Promise<ApiResponse<VehicleResponse>> => {
    return apiClient.get(`/cars/${carId}`);
  },

  /**
   * Tạo phương tiện mới
   */
  createVehicle: async (data: VehicleRequest): Promise<ApiResponse<VehicleResponse>> => {
    return apiClient.post('/cars', data);
  },

  /**
   * Cập nhật phương tiện
   */
  updateVehicle: async (carId: string, data: VehicleRequest): Promise<ApiResponse<VehicleResponse>> => {
    return apiClient.put(`/cars/${carId}`, data);
  },

  /**
   * Xóa phương tiện
   */
  deleteVehicle: async (carId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/cars/${carId}`);
  },
};
