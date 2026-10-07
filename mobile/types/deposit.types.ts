export type FilterTab = 'all' | 'depositing';

/** Room dùng trong deposit list (từ API rooms) */
export interface DepositRoom {
  roomId: string;
  name: string;
  price: number;
  deposit: number;
  status: boolean;
  /** Thông tin cọc nếu phòng đang được cọc */
  reservation?: RoomReservation | null;
}

/** Response từ API /room-reservations */
export interface RoomReservation {
  id?: string;
  roomReservationId?: string;
  createDate: string;
  moveInDate: string;
  nameTenant: string;
  phoneTenant: string;
  deposit: number;
  note?: string;
  status?: string;
  roomId?: string;
  room?: {
    roomId: string;
    name: string;
    price: number;
  };
}

/** Request body gửi lên khi tạo/cập nhật cọc */
export interface RoomReservationRequest {
  createDate: string;
  moveInDate: string;
  nameTenant: string;
  phoneTenant: string;
  deposit: number;
  note?: string;
  status?: string | null;
  roomId: string;
}

/** Kiểu cũ giữ lại để không break các component đang dùng */
export interface Room {
  id: string;
  title: string;
  price: string;
  status: string;
}
