const PAID_STATUSES = new Set(['PAID', 'CANCELED'])

export const extractInvoiceItems = (response) => {
  const result = response?.result ?? response?.data?.result ?? response
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.items)) return result.items
  if (Array.isArray(result?.content)) return result.content
  return []
}

export const sumInvoiceTransactions = (invoice) =>
  (invoice?.transactions || []).reduce(
    (total, transaction) => total + Number(transaction.amount ?? transaction.totalAmount ?? 0),
    0
  )

export const getInvoiceRemainingAmount = (invoice) =>
  Math.max(0, Number(invoice?.totalAmount || 0) - sumInvoiceTransactions(invoice))

export const isUnpaidInvoice = (invoice) => !PAID_STATUSES.has(invoice?.paymentStatus)

export const getUnpaidInvoicesByRoom = (invoices = [], roomId) =>
  invoices
    .filter((invoice) => invoice.roomId === roomId && isUnpaidInvoice(invoice))
    .sort((first, second) => new Date(second.invoiceCreateDate || 0) - new Date(first.invoiceCreateDate || 0))

export const computeRoomDebtFromInvoices = (invoices = [], roomId) =>
  getUnpaidInvoicesByRoom(invoices, roomId).reduce((total, invoice) => total + getInvoiceRemainingAmount(invoice), 0)

export const computeTotalDebtFromRooms = (rooms = []) =>
  rooms.reduce((total, room) => total + Number(room.debt || 0), 0)

export const enrichRoomsWithDebt = (rooms = [], invoices = []) =>
  rooms.map((room) => ({
    ...room,
    debt: computeRoomDebtFromInvoices(invoices, room.roomId)
  }))

export const mergeInvoicesById = (invoices = []) =>
  invoices
    .filter(Boolean)
    .filter((invoice, index, list) => list.findIndex((item) => item.invoiceId === invoice.invoiceId) === index)
