/**
 * Motel Type Definitions
 */

import { MotelServiceItem } from './service-settings.types';

export interface MotelResponse {
  motelId: string;
  motelName: string;
  area: number;
  averagePrice: number;
  address: string;
  maxperson: number;
  invoicedate: number;
  paymentdeadline: number;
  motelServices?: MotelServiceItem[];
}
