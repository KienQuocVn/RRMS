import { apiClient } from './client';
import { Contract } from '@/types/contract.types';

export const contractService = {
  /**
   * Lấy danh sách hợp đồng theo Motel ID
   */
  getContractsByMotel: async (motelId: string): Promise<Contract[]> => {
    return apiClient.get(`/contracts/motel/${motelId}`);
  },

  /**
   * Lấy hợp đồng theo Room ID
   */
  getContractByRoom: async (roomId: string): Promise<Contract> => {
    return apiClient.get(`/contracts/room/${roomId}`);
  },

  /**
   * Lấy hợp đồng theo ID
   */
  getContractById: async (contractId: string): Promise<Contract> => {
    return apiClient.get(`/contracts/${contractId}`);
  },
};
