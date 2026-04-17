import httpClient from './httpClient'

export const createInvoice = async (invoiceData) => {
  const response = await httpClient.post('/invoices/create', invoiceData)

  return response.data
}

// Hàm lấy danh sách hóa đơn theo motelId
export const fetchInvoices = async (motelId) => {
  const response = await httpClient.get(`/invoices/motel/${motelId}`)

  return response.data
}

