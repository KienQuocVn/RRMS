import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { ContractResponse } from '@/types/contract.types';

export const contractService = {
  /**
   * Tạo hợp đồng mới
   */
  createContract: async (data: any): Promise<ContractResponse> => {
    return apiClient.post(API_ENDPOINTS.CONTRACTS.BASE, data);
  },

  /**
   * Lấy hợp đồng theo ID
   */
  getContractById: async (contractId: string): Promise<ContractResponse> => {
    return apiClient.get(`${API_ENDPOINTS.CONTRACTS.BASE}/${contractId}`);
  },

  /**
   * Lấy danh sách hợp đồng theo nhà trọ
   */
  getContractsByMotel: async (motelId: string): Promise<any> => {
    return apiClient.get(API_ENDPOINTS.CONTRACTS.GET_BY_MOTEL(motelId));
  },

  /**
   * Cập nhật hợp đồng
   */
  updateContract: async (contractId: string, data: any): Promise<ContractResponse> => {
    return apiClient.put(`${API_ENDPOINTS.CONTRACTS.BASE}/${contractId}`, data);
  },

  /**
   * Xóa hợp đồng
   */
  deleteContract: async (contractId: string): Promise<void> => {
    return apiClient.delete(`${API_ENDPOINTS.CONTRACTS.BASE}/${contractId}`);
  },

  /**
   * Kết thúc hợp đồng theo phòng
   */
  endContract: async (roomId: string, endDate?: string): Promise<void> => {
    const params = endDate ? { endDate } : {};
    return apiClient.put(`${API_ENDPOINTS.CONTRACTS.BASE}/room/${roomId}/end`, null, { params });
  },

  /**
   * Cập nhật trạng thái hợp đồng
   */
  updateStatus: async (params: { roomId: string, newStatus: string, reportCloseDate?: string }): Promise<string> => {
    return apiClient.put(API_ENDPOINTS.CONTRACTS.UPDATE_STATUS, null, { params });
  },

  /**
   * Lấy toàn bộ mẫu hợp đồng
   */
  getTemplates: async (): Promise<any[]> => {
    return apiClient.get(API_ENDPOINTS.TEMPLATES.BASE);
  },
};
