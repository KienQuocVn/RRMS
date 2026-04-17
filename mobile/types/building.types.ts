export type RentType = 'room' | 'bed';

export interface BuildingFormData {
  rentType: RentType;
  isAutoInit: boolean;
}
