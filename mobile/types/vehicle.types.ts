/**
 * Vehicle Type Definitions
 */

export interface VehicleRequest {
  name: string;
  number: string;
  image?: string;
  roomId: string;
  tenantId: string;
}

export interface VehicleResponse {
  carId: string;
  name: string;
  number: string;
  image: string;
  roomId: string;
  tenantId: string;
  tenantName: string;
  roomName?: string;
}
