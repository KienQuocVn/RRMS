export type RentType = 'room' | 'bed' | 'mini_apartment' | 'apartment_building' | 'whole_house' | 'office';

export interface BuildingFormData {
  rentType: RentType;
  isAutoInit: boolean;
}

export interface BuildingAddress {
  provinceCode: string;
  city: string;
  districtCode: string;
  district: string;
  wardCode: string;
  ward: string;
  detail: string;
  hasMapPin: boolean;
  mapLabel: string;
  latitude: number | null;
  longitude: number | null;
}
