import { apiClient } from './client';
import { ApiResponse } from '@/types/common.types';

export const tenantService = {
  /**
   * Lấy toàn bộ khách thuê
   */
  getAllTenants: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/tenant');
  },

  /**
   * Lấy khách thuê theo ID
   */
  getTenantById: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get('/tenant/tenant-id', { params: { id } });
  },

  /**
   * Thêm khách thuê vào phòng
   */
  insertTenant: async (roomId: string, data: any): Promise<ApiResponse<any>> => {
    return apiClient.post(`/tenant/insert/${roomId}`, data);
  },

  /**
   * Lấy danh sách khách thuê theo phòng
   */
  getTenantsByRoom: async (roomId: string): Promise<ApiResponse<any[]>> => {
    return apiClient.get(`/tenant/roomId/${roomId}`);
  },

  /**
   * Cập nhật khách thuê
   */
  updateTenant: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiClient.put(`/tenant/${id}`, data);
  },

  /**
   * Xóa khách thuê
   */
  deleteTenant: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiClient.delete(`/tenant/${id}`);
  },

  /**
   * Xóa toàn bộ khách thuê trong phòng
   */
  deleteTenantByRoom: async (roomId: string): Promise<ApiResponse<boolean>> => {
    return apiClient.delete(`/tenant/room/${roomId}`);
  },
};
