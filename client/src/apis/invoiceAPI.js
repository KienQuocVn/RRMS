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
export const fetchInvoices = async (motelId, params = {}) => {
  const response = await httpClient.get(`/invoices/motel/${motelId}`, { params })

  return response.data
}

export const fetchAllInvoicesByMotelId = async (motelId) => {
  const pageSize = 100
  let page = 0
  let allItems = []
  let totalPages = 1

  while (page < totalPages) {
    const response = await fetchInvoices(motelId, {
      page,
      size: pageSize,
      sortBy: 'invoiceCreateDate',
      sortDirection: 'DESC'
    })

    const result = response?.result
    const items = result?.items || []
    allItems = allItems.concat(items)
    totalPages = result?.totalPages ?? 1
    page += 1
  }

  return allItems
}
