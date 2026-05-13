import { create } from 'zustand';
import { BuildingAddress, RentType } from '@/types/building.types';

interface AddBuildingFlowState {
  rentType: RentType;
  isAutoInit: boolean;
  address: BuildingAddress;
  setRentType: (rentType: RentType) => void;
  setIsAutoInit: (isAutoInit: boolean) => void;
  setAddress: (address: BuildingAddress) => void;
  resetAddress: () => void;
}

const initialAddress: BuildingAddress = {
  city: '',
  district: '',
  ward: '',
  detail: '',
  hasMapPin: false,
  mapLabel: '',
};

export const useAddBuildingFlow = create<AddBuildingFlowState>((set) => ({
  rentType: 'room',
  isAutoInit: true,
  address: initialAddress,
  setRentType: (rentType) => set({ rentType }),
  setIsAutoInit: (isAutoInit) => set({ isAutoInit }),
  setAddress: (address) => set({ address }),
  resetAddress: () => set({ address: initialAddress }),
}));
