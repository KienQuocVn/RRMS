export type RentType = 'room' | 'bed';

export interface BuildingFormData {
  rentType: RentType;
  isAutoInit: boolean;
}

export interface BuildingAddress {
  city: string;
  district: string;
  ward: string;
  detail: string;
  hasMapPin: boolean;
  mapLabel: string;
}
