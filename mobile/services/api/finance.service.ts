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
   * Lấy danh sách hóa đơn theo nhà trọ
   */
  getInvoicesByMotel: async (motelId: string, params?: { page?: number, size?: number, sortBy?: string, sortDirection?: string }): Promise<any> => {
    return apiClient.get(`${API_ENDPOINTS.INVOICES.BASE}/motel/${motelId}`, { params });
  },

  /**
   * Cập nhật hóa đơn
   */
  updateInvoice: async (invoiceId: string, data: any): Promise<any> => {
    return apiClient.put(`${API_ENDPOINTS.INVOICES.BASE}/${invoiceId}`, data);
  },

  /**
   * Hủy hóa đơn
   */
  cancelInvoice: async (invoiceId: string): Promise<any> => {
    return apiClient.put(`${API_ENDPOINTS.INVOICES.BASE}/${invoiceId}/cancel`);
  },

  /**
   * Xóa hóa đơn
   */
  deleteInvoice: async (invoiceId: string): Promise<any> => {
    return apiClient.delete(`${API_ENDPOINTS.INVOICES.BASE}/${invoiceId}`);
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
