import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { BackendResponse } from '@/types/common.types';

export const featureService = {
  /**
   * Đăng tin cho thuê (Bulletin Board)
   */
  createBulletin: async (data: any): Promise<BackendResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.BULLETIN.BASE, data);
  },

  /**
   * Tìm kiếm phòng theo địa chỉ
   */
  searchByAddress: async (address: string): Promise<BackendResponse<any[]>> => {
    return apiClient.get(API_ENDPOINTS.SEARCH.ADDRESS, { params: { address } });
  },

  /**
   * Thống kê
   */
  getStatistics: async (type: 'accounts' | 'tenants' | 'motels'): Promise<number> => {
    const endpoint = type === 'accounts' ? API_ENDPOINTS.STATS.ACCOUNTS : 
                     type === 'tenants' ? API_ENDPOINTS.STATS.TENANTS : 
                     API_ENDPOINTS.STATS.MOTELS;
    return apiClient.get(endpoint);
  },

  /**
   * Báo cáo tổng số phòng
   */
  getTotalRoomsReport: async (params: { motelId: string, username: string }): Promise<number> => {
    return apiClient.get(API_ENDPOINTS.REPORTS.TOTAL_ROOMS, { params });
  },

  /**
   * Ghi chỉ số điện nước
   */
  createMeterReading: async (data: any): Promise<any> => {
    return apiClient.post(API_ENDPOINTS.METER.READINGS, data);
  },

  /**
   * Giữ chỗ
   */
  reservePlace: async (data: any): Promise<any> => {
    return apiClient.post(API_ENDPOINTS.RESERVE.BASE, data);
  },

  /**
   * Hỗ trợ & Phản hồi
   */
  createSupport: async (data: any): Promise<BackendResponse<boolean>> => {
    return apiClient.post(API_ENDPOINTS.SUPPORT.CREATE, data);
  },
};
