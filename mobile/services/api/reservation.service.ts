import { apiClient } from './client';
import { ApiResponse } from '@/types/common.types';
import { RoomReservation, RoomReservationRequest } from '@/types/deposit.types';
import { API_ENDPOINTS } from './endpoints';

export const reservationService = {
  /**
   * Tạo mới cọc giữ chỗ
   */
  createReservation: async (data: RoomReservationRequest): Promise<ApiResponse<RoomReservation>> => {
    return apiClient.post(API_ENDPOINTS.RESERVE.CREATE, data);
  },

  /**
   * Lấy danh sách cọc theo phòng
   */
  getReservationsByRoom: async (roomId: string): Promise<ApiResponse<RoomReservation[]>> => {
    return apiClient.get(API_ENDPOINTS.RESERVE.GET_BY_ROOM(roomId));
  },

  /**
   * Lấy chi tiết cọc theo ID
   */
  getReservationById: async (id: string): Promise<ApiResponse<RoomReservation>> => {
    return apiClient.get(API_ENDPOINTS.RESERVE.GET_BY_ID(id));
  },

  /**
   * Cập nhật thông tin cọc (gia hạn ngày vào)
   */
  updateReservation: async (
    id: string,
    data: RoomReservationRequest,
  ): Promise<ApiResponse<RoomReservation>> => {
    return apiClient.put(API_ENDPOINTS.RESERVE.UPDATE(id), data);
  },

  /**
   * Xóa cọc (bỏ cọc)
   */
  deleteReservation: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(API_ENDPOINTS.RESERVE.DELETE(id));
  },
};
