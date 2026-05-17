import { create } from 'zustand';
import { BuildingAddress, RentType } from '@/types/building.types';

interface AddBuildingFlowState {
  rentType: RentType;
  isAutoInit: boolean;
  address: BuildingAddress;
  setRentType: (rentType: RentType) => void;
  setIsAutoInit: (isAutoInit: boolean) => void;
  setAddress: (address: BuildingAddress) => void;
  updateAddress: (address: Partial<BuildingAddress>) => void;
  resetAddress: () => void;
}

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

export const useAddBuildingFlow = create<AddBuildingFlowState>((set) => ({
  rentType: 'room',
  isAutoInit: true,
  address: initialAddress,
  setRentType: (rentType) => set({ rentType }),
  setIsAutoInit: (isAutoInit) => set({ isAutoInit }),
  setAddress: (address) => set({ address }),
  updateAddress: (address) =>
    set((state) => ({
      address: {
        ...state.address,
        ...address,
      },
    })),
  resetAddress: () => set({ address: initialAddress }),
}));
