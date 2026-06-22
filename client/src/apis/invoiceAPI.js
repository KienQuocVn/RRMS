import httpClient from './httpClient'

export const createInvoice = async (invoiceData) => {
  const response = await httpClient.post('/invoices/create', invoiceData)

  return response.data
}

export const collectInvoicePayment = async (invoiceId, paymentData) => {
  const response = await httpClient.patch(`/invoices/${invoiceId}/collect-payment`, paymentData)

  return response.data
}

// Ham lay danh sach hoa don theo motelId
export const fetchInvoices = async (motelId) => {
  const response = await httpClient.get(`/invoices/motel/${motelId}`)

  return response.data
}
