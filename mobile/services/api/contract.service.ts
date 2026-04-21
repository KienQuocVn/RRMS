import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { ContractResponse } from '@/types/contract.types';
import { BackendResponse } from '@/types/common.types';

export const contractService = {
  /**
   * Tạo hợp đồng mới
   */
  createContract: async (data: any): Promise<ContractResponse> => {
    return apiClient.post(API_ENDPOINTS.CONTRACTS.BASE, data);
  },

  /**
   * Lấy danh sách hợp đồng theo nhà trọ
   */
  getContractsByMotel: async (motelId: string): Promise<ContractResponse[]> => {
    return apiClient.get(API_ENDPOINTS.CONTRACTS.GET_BY_MOTEL(motelId));
  },

  /**
   * Cập nhật trạng thái hợp đồng
   */
  updateStatus: async (params: { roomId: string, newStatus: string, reportCloseDate: string }): Promise<string> => {
    return apiClient.put(API_ENDPOINTS.CONTRACTS.UPDATE_STATUS, null, { params });
  },

  /**
   * Lấy toàn bộ mẫu hợp đồng
   */
  getTemplates: async (): Promise<any[]> => {
    return apiClient.get(API_ENDPOINTS.TEMPLATES.BASE);
  },
};
