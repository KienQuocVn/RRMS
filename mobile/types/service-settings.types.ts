export interface MotelServiceItem {
  motelServiceId: string;
  motelId: string;
  nameService: string;
  price: number;
  chargetype: string;
}

export interface CreateMotelServicePayload {
  motelId: string;
  nameService: string;
  price: number;
  chargetype: string;
  selectedRooms: string[];
}

export interface UpdateMotelServicePayload {
  nameService: string;
  price: number;
  chargetype: string;
  selectedRooms: string[];
}
