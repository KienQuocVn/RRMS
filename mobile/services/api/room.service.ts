import { apiClient } from './client';
import { Room } from '@/types/room.types';

export const roomService = {
  /**
   * Lấy danh sách tất cả các phòng
   */
  getAllRooms: async (): Promise<Room[]> => {
    return apiClient.get('/room');
  },

  /**
   * Lấy chi tiết phòng theo ID
   */
  getRoomById: async (roomId: string): Promise<Room> => {
    return apiClient.get(`/room/${roomId}`);
  },

  /**
   * Lấy danh sách phòng theo Motel ID
   */
  getRoomsByMotel: async (motelId: string): Promise<Room[]> => {
    return apiClient.get(`/room/motel/${motelId}`);
  },
};
