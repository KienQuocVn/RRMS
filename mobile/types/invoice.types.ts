/**
 * Invoice Type Definitions
 */

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
}

export interface InvoiceServiceDetailResponse {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  oldIndex?: number;
  newIndex?: number;
  totalPrice: number;
}

export interface InvoiceDeviceDetailResponse {
  deviceId: string;
  deviceName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface InvoiceAdditionItemResponse {
  name: string;
  amount: number;
  description?: string;
}

export interface InvoiceResponse {
  invoiceId: string;
  invoiceReason: string;
  roomId: string;
  roomName: string;
  roomPrice: number;
  invoiceCreateMonth: string; // "YYYY-MM"
  invoiceCreateDate: string;  // "YYYY-MM-DD"
  dueDate: string;
  moveinDate: string;
  moveInDueDate: string;
  deposit: number;
  serviceDetails: InvoiceServiceDetailResponse[];
  deviceDetails: InvoiceDeviceDetailResponse[];
  additionItems: InvoiceAdditionItemResponse[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
}
