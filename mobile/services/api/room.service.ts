import { ApiResponse } from '@/types/common.types';
import { RoomResponse2 } from '@/types/room.types';

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const roomService = {
  createRoom: async (data: any): Promise<ApiResponse<RoomResponse2>> => {
    return apiClient.post(API_ENDPOINTS.ROOMS.BASE, data);
  },

  getRoomsByMotel: async (motelId: string): Promise<ApiResponse<RoomResponse2[]>> => {
    return apiClient.get(API_ENDPOINTS.ROOMS.GET_BY_MOTEL(motelId));
  },

  getServicesByRoom: async (roomId: string): Promise<ApiResponse<any[]>> => {
    return apiClient.get(API_ENDPOINTS.SERVICES.GET_BY_ROOM(roomId));
  },

  getDevicesByRoom: async (roomId: string): Promise<ApiResponse<any>> => {
    return apiClient.get(API_ENDPOINTS.DEVICES.GET_BY_ROOM(roomId));
  },
};
