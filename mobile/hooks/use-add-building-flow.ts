import { create } from 'zustand';
import { BuildingAddress, RentType } from '@/types/building.types';

/**
 * Thông tin cơ bản nhà trọ (bước 1 - AddBuildingForm)
 */
export interface BuildingBasicInfo {
  buildingName: string;       // Tên nhà trọ *
  rentType: RentType;         // Loại hình *
  floorValue: string;         // Số tầng *
  sampleRoomCount: string;    // Số phòng mẫu *
  sampleArea: string;         // Diện tích mẫu *
  samplePrice: string;        // Giá thuê mẫu *
  maxOccupancy: string;       // Tối đa người/phòng
  invoiceDay: string;         // Ngày lập hóa đơn *
  paymentDeadline: string;    // Hạn đóng tiền *
  isAutoInit: boolean;        // Cách khởi tạo
}

interface AddBuildingFlowState {
  // Bước 1: Thông tin cơ bản
  basicInfo: BuildingBasicInfo;
  // Bước 2: Địa chỉ
  address: BuildingAddress;

  setBasicInfo: (info: Partial<BuildingBasicInfo>) => void;
  setAddress: (address: BuildingAddress) => void;
  updateAddress: (address: Partial<BuildingAddress>) => void;
  resetAddress: () => void;
  resetAll: () => void;

  // Legacy selectors (tương thích với code cũ)
  rentType: RentType;
  isAutoInit: boolean;
  setRentType: (rentType: RentType) => void;
  setIsAutoInit: (isAutoInit: boolean) => void;
}

const initialBasicInfo: BuildingBasicInfo = {
  buildingName: '',
  rentType: 'room',
  floorValue: 'ground',
  sampleRoomCount: '5',
  sampleArea: '15',
  samplePrice: '',
  maxOccupancy: '',
  invoiceDay: '1',
  paymentDeadline: '5',
  isAutoInit: true,
};

const initialAddress: BuildingAddress = {
  provinceCode: '',
  city: '',
  districtCode: '',
  district: '',
  wardCode: '',
  ward: '',
  detail: '',
  hasMapPin: false,
  mapLabel: '',
  latitude: null,
  longitude: null,
};

export const useAddBuildingFlow = create<AddBuildingFlowState>((set, get) => ({
  basicInfo: initialBasicInfo,
  address: initialAddress,

  // Flat values for legacy compatibility
  rentType: initialBasicInfo.rentType,
  isAutoInit: initialBasicInfo.isAutoInit,

  setBasicInfo: (info) =>
    set((state) => {
      const nextBasicInfo = { ...state.basicInfo, ...info };
      return {
        basicInfo: nextBasicInfo,
        rentType: nextBasicInfo.rentType,
        isAutoInit: nextBasicInfo.isAutoInit,
      };
    }),

  setAddress: (address) => set({ address }),

  updateAddress: (address) =>
    set((state) => ({
      address: { ...state.address, ...address },
    })),

  resetAddress: () => set({ address: initialAddress }),

  resetAll: () =>
    set({
      basicInfo: initialBasicInfo,
      address: initialAddress,
      rentType: initialBasicInfo.rentType,
      isAutoInit: initialBasicInfo.isAutoInit,
    }),

  // Legacy setters
  setRentType: (rentType) =>
    set((state) => ({
      basicInfo: { ...state.basicInfo, rentType },
      rentType,
    })),

  setIsAutoInit: (isAutoInit) =>
    set((state) => ({
      basicInfo: { ...state.basicInfo, isAutoInit },
      isAutoInit,
    })),
}));
