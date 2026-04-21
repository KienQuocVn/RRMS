import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { BackendResponse } from '@/types/common.types';

export const tenantService = {
  /**
   * Thêm khách thuê vào phòng
   */
  insertTenant: async (roomId: string, data: any): Promise<BackendResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.TENANTS.INSERT(roomId), data);
  },

  /**
   * Lấy danh sách khách thuê theo phòng
   */
  getTenantsByRoom: async (roomId: string): Promise<BackendResponse<any[]>> => {
    return apiClient.get(API_ENDPOINTS.TENANTS.GET_BY_ROOM(roomId));
  },
};
