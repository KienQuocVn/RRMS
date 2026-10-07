import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { FilterTab, DepositRoom, RoomReservation } from '@/types/deposit.types';
import { useAuth } from '@/hooks/use-auth';
import { motelService } from '@/services/api/motel.service';
import { roomService } from '@/services/api/room.service';
import { reservationService } from '@/services/api/reservation.service';
import { safeAsyncStorage } from '@/services/storage/safe-async-storage';

export function useDeposit() {
  const user = useAuth((state) => state.user);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchText, setSearchText] = useState('');
  const [rooms, setRooms] = useState<DepositRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Tải danh sách phòng và trạng thái cọc từ API
   */
  const loadRooms = useCallback(async () => {
    if (!user?.username) return;

    setIsLoading(true);
    try {
      // 1. Lấy motel đang active
      const motelsResponse = await motelService.getMotelsByAccount(user.username);
      const motelList = motelsResponse.result || [];

      const storedMotelId = await safeAsyncStorage.getItem('rrms_active_motel_id');
      const activeMotel =
        motelList.find((m: any) => m.motelId === storedMotelId) ?? motelList[0] ?? null;

      if (!activeMotel) {
        setRooms([]);
        return;
      }

      // 2. Lấy danh sách phòng
      const roomsResponse = await roomService.getRoomsByMotel(activeMotel.motelId);
      // Chỉ hiển thị phòng trống hoặc đang được giữ chỗ. Các phòng OCCUPIED,
      // MAINTENANCE và trạng thái chờ kỳ thu không phải đối tượng đặt cọc.
      const rawRooms = (roomsResponse.result || []).filter((room: any) => {
        const status = String(room.status ?? '').trim().toUpperCase();
        return room.status === true || status === 'AVAILABLE' || status === 'RESERVED';
      });

      // 3. Với mỗi phòng, lấy thông tin cọc (nếu có)
      const roomsWithReservation: DepositRoom[] = await Promise.all(
        rawRooms.map(async (room: any) => {
          try {
            const resResponse = await reservationService.getReservationsByRoom(room.roomId);
            const reservations: any[] = resResponse.result || [];
            // Chỉ gắn khoản cọc còn hiệu lực; bỏ qua lịch sử đã hủy/kết thúc.
            const rawRes = reservations.find((reservation: any) => {
              const status = String(reservation.status ?? '').toUpperCase();
              return !['CANCELLED', 'ENDED', 'COMPLETED', 'REFUNDED'].includes(status);
            }) ?? null;
            const activeReservation: RoomReservation | null = rawRes
              ? {
                  ...rawRes,
                  id: rawRes.roomReservationId || rawRes.id,
                  roomId: room.roomId,
                }
              : null;
            return {
              roomId: room.roomId,
              name: room.name,
              price: room.price,
              deposit: room.deposit,
              status: room.status,
              reservation: activeReservation,
            } as DepositRoom;
          } catch {
            return {
              roomId: room.roomId,
              name: room.name,
              price: room.price,
              deposit: room.deposit,
              status: room.status,
              reservation: null,
            } as DepositRoom;
          }
        }),
      );

      setRooms(roomsWithReservation);
    } catch (error: any) {
      Alert.alert(
        'Lỗi tải dữ liệu',
        error?.response?.data?.message || 'Không thể kết nối đến máy chủ.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  // Lọc phòng theo search text và filter tab
  const filteredRooms = rooms.filter((room) => {
    const matchSearch = room.name.toLowerCase().includes(searchText.toLowerCase());
    if (activeFilter === 'depositing') {
      return matchSearch && !!room.reservation;
    }
    return matchSearch;
  });

  // Đếm badge
  const depositingCount = rooms.filter((r) => !!r.reservation).length;
  const totalCount = rooms.length;

  return {
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    rooms: filteredRooms,
    isLoading,
    loadRooms,
    depositingCount,
    totalCount,
  };
}
