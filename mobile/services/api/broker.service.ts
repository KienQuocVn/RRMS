import { apiClient } from './client';
import { ApiResponse } from '@/types/common.types';
import { Broker, BrokerRequest } from '@/types/broker.types';

export const brokerService = {
  getByMotel: (motelId: string): Promise<ApiResponse<Broker[]>> =>
    apiClient.get(`/broker/${motelId}`),

  create: (data: BrokerRequest): Promise<ApiResponse<Broker>> =>
    apiClient.post('/broker', data),

  update: (brokerId: string, data: BrokerRequest): Promise<ApiResponse<Broker>> =>
    apiClient.put(`/broker/${brokerId}`, data),

  delete: (brokerId: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/broker/${brokerId}`),
};
