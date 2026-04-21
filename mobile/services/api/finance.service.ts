import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { BackendResponse } from '@/types/common.types';

export const financeService = {
  /**
   * Tạo hóa đơn
   */
  createInvoice: async (data: any): Promise<any> => {
    return apiClient.post(API_ENDPOINTS.INVOICES.CREATE, data);
  },

  /**
   * Thu tiền hóa đơn
   */
  collectPayment: async (invoiceId: string, data: any): Promise<any> => {
    return apiClient.patch(API_ENDPOINTS.INVOICES.COLLECT(invoiceId), data);
  },

  /**
   * Tạo thanh toán VNPay
   */
  createVNPayPayment: async (data: { totalPrice: number, userName: string, bankCode: string }): Promise<any> => {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.VNPAY, data);
  },

  /**
   * Tạo thanh toán PayPal
   */
  createPayPalPayment: async (params: { totalPrice: number, userName: string }): Promise<any> => {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.PAYPAL, null, { params });
  },

  /**
   * Tạo phiếu thu
   */
  createReceipt: async (params: { username: string }, data: any): Promise<any> => {
    return apiClient.post(`${API_ENDPOINTS.TRANSACTIONS.RECEIPTS}`, data, { params });
  },

  /**
   * Tạo phiếu chi
   */
  createExpense: async (params: { username: string }, data: any): Promise<any> => {
    return apiClient.post(`${API_ENDPOINTS.TRANSACTIONS.EXPENSES}`, data, { params });
  },
};
