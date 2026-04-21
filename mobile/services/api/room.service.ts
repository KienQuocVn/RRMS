import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { RoomResponse2 } from '@/types/room.types';
import { BackendResponse } from '@/types/common.types';

export const roomService = {
  /**
   * Tạo phòng mới
   */
  createRoom: async (data: any): Promise<RoomResponse2> => {
    return apiClient.post(API_ENDPOINTS.ROOMS.BASE, data);
  },

  /**
   * Lấy danh sách phòng theo nhà trọ
   */
  getRoomsByMotel: async (motelId: string): Promise<RoomResponse2[]> => {
    return apiClient.get(API_ENDPOINTS.ROOMS.GET_BY_MOTEL(motelId));
  },

  /**
   * Lấy dịch vụ theo phòng
   */
  getServicesByRoom: async (roomId: string): Promise<any[]> => {
    return apiClient.get(API_ENDPOINTS.SERVICES.GET_BY_ROOM(roomId));
  },

  /**
   * Lấy thiết bị theo phòng
   */
  getDevicesByRoom: async (roomId: string): Promise<any> => {
    return apiClient.get(API_ENDPOINTS.DEVICES.GET_BY_ROOM(roomId));
  },
};
