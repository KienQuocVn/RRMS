/**
 * Room Type Definitions
 */

export interface RoomServiceResponse {
  serviceId: string;
  serviceName: string;
  price: number;
  unit: string;
}

export interface Room {
  roomId: string;
  motelId: string;
  name: string;
  group: string;
  price: number;
  prioritize: string;
  area: number;
  deposit: number;
  status: boolean;
  finance: string;
  description: string;
  services: RoomServiceResponse[];
}
