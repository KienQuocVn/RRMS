import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { motelService } from '@/services/api/motel.service';
import { roomService } from '@/services/api/room.service';
import { contractService } from '@/services/api/contract.service';
import { reservationService } from '@/services/api/reservation.service';
import { safeAsyncStorage } from '@/services/storage/safe-async-storage';
import { DepositRoom, RoomReservation } from '@/types/deposit.types';

export function useContract() {
  const user = useAuth((state) => state.user);
  const username = user?.username;

  const [searchText, setSearchText] = useState('');
  const [rooms, setRooms] = useState<DepositRoom[]>([]);
  const [activeMotelId, setActiveMotelId] = useState<string>('');
  const [activeMotelName, setActiveMotelName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Tải danh sách phòng có thể lập hợp đồng (chỉ lấy các phòng ĐANG TRỐNG / ĐANG CỌC GIỮ CHỖ,
   * loại bỏ hoàn toàn các phòng đang ở, chờ kỳ thu tới, hoặc đã có hợp đồng hiệu lực).
   */
  const loadRooms = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    try {
      // 1. Lấy motel đang active của tài khoản
      const motelsResponse = await motelService.getMotelsByAccount(username);
      const motelList = motelsResponse.result || [];

      const storedMotelId = await safeAsyncStorage.getItem('rrms_active_motel_id');
      const activeMotel =
        motelList.find((m: any) => m.motelId === storedMotelId) ?? motelList[0] ?? null;

      if (!activeMotel) {
        setRooms([]);
        setActiveMotelId('');
        return;
      }

      setActiveMotelId(activeMotel.motelId);
      setActiveMotelName(activeMotel.motelName || '');

      // 2. Lấy danh sách toàn bộ phòng và danh sách hợp đồng của khu trọ song song
      const [allRoomsRes, contractsRes] = await Promise.allSettled([
        roomService.getRoomsByMotel(activeMotel.motelId),
        contractService.getContractsByMotel(activeMotel.motelId),
      ]);

      const rawRooms: any[] =
        allRoomsRes.status === 'fulfilled' && allRoomsRes.value?.result
          ? allRoomsRes.value.result
          : [];

      // Tập hợp các ID và tên phòng đang có hợp đồng chưa kết thúc (ACTIVE, REPORTEND, EXPIRING, PENDING,...)
      const activeContractRoomIds = new Set<string>();
      const activeContractRoomNames = new Set<string>();

      if (contractsRes.status === 'fulfilled') {
        const contractList = Array.isArray(contractsRes.value)
          ? contractsRes.value
          : (contractsRes.value as any)?.result || [];

        contractList.forEach((c: any) => {
          const cStatus = String(c.status ?? '').toUpperCase();
          const rId = c.roomId || c.room?.roomId;
          const rName = c.roomName || c.room?.name;

          // Hợp đồng chưa kết thúc / chưa hủy -> phòng đang có người ở / đã ký hợp đồng
          if (cStatus !== 'ENDED' && cStatus !== 'CANCELLED') {
            if (rId) activeContractRoomIds.add(String(rId));
            if (rName) activeContractRoomNames.add(String(rName).trim().toLowerCase());
          }
        });
      }

      // 3. Lọc nghiêm ngặt: CHỈ LẤY CÁC PHÒNG ĐANG TRỐNG HOẶC ĐANG CỌC
      // Loại bỏ hoàn toàn các phòng đang ở, chờ kỳ thu, có hợp đồng hiệu lực
      const availableRooms = rawRooms.filter((room: any) => {
        if (!room || !room.roomId) return false;

        const roomIdStr = String(room.roomId);
        const roomNameStr = String(room.name || '').trim().toLowerCase();

        // 3.1. Loại bỏ nếu phòng có trong danh sách hợp đồng đang hoạt động
        if (activeContractRoomIds.has(roomIdStr) || (roomNameStr && activeContractRoomNames.has(roomNameStr))) {
          return false;
        }

        // 3.2. Loại bỏ nếu latestContract trên room chưa kết thúc
        if (room.latestContract) {
          const latestStatus = String(room.latestContract.status ?? '').toUpperCase();
          if (latestStatus && latestStatus !== 'ENDED' && latestStatus !== 'CANCELLED') {
            return false;
          }
        }

        // 3.3. Loại bỏ nếu trạng thái phòng là Đang ở (status = false trong DB) hoặc có trạng thái occupied/rented/maintenance
        const statusStr = String(room.status ?? '').toUpperCase();
        if (
          room.status === false ||
          statusStr === 'OCCUPIED' ||
          statusStr === 'RENTED' ||
          statusStr === 'MAINTENANCE' ||
          statusStr === 'DANG_O' ||
          statusStr.includes('ĐANG Ở') ||
          statusStr.includes('CHỜ KỲ THU')
        ) {
          return false;
        }

        return true;
      });

      // 4. Lấy thông tin cọc của từng phòng (nếu có)
      const roomsWithData: DepositRoom[] = await Promise.all(
        availableRooms.map(async (room: any) => {
          try {
            const resResponse = await reservationService.getReservationsByRoom(room.roomId);
            const reservations: any[] = resResponse.result || [];
            // Lấy reservation đang có hiệu lực (chưa hủy / chưa hoàn tất)
            const activeRes =
              reservations.find((r: any) => {
                const resStatus = String(r.status ?? '').toUpperCase();
                return (
                  resStatus !== 'CANCELLED' &&
                  resStatus !== 'COMPLETED' &&
                  resStatus !== 'REFUNDED'
                );
              }) || (reservations.length > 0 ? reservations[0] : null);

            const activeReservation: RoomReservation | null = activeRes
              ? {
                  ...activeRes,
                  id: activeRes.roomReservationId || activeRes.id,
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

      setRooms(roomsWithData);
    } catch (error: any) {
      Alert.alert(
        'Lỗi tải dữ liệu',
        error?.response?.data?.message || 'Không thể kết nối đến máy chủ.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Lọc phòng theo search text
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return {
    searchText,
    setSearchText,
    rooms: filteredRooms,
    allRooms: rooms,
    activeMotelId,
    activeMotelName,
    isLoading,
    loadRooms,
  };
}
