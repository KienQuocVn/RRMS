import httpClient from './httpClient'

/**
 * Lấy hợp đồng theo roomId — dùng cho CUSTOMER xem hợp đồng của phòng mình đang thuê
 */
export const getContractByRoomId = async (roomId) => {
  const response = await httpClient.get(`/contracts/room/${roomId}`)
  // Backend trả 204 No Content khi phòng chưa có hợp đồng
  if (response.status === 204 || !response.data) return null
  return response.data
}

/**
 * Lấy hợp đồng theo contractId
 */
export const getContractById = async (contractId) => {
  const response = await httpClient.get(`/contracts/${contractId}`)
  return response.data
}

/**
 * Format ngày từ Date string sang dd/MM/yyyy
 */
export const formatContractDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('vi-VN')
  } catch {
    return '—'
  }
}

/**
 * Tính số tháng còn lại giữa 2 ngày
 */
export const calcRemainingMonths = (endDateStr) => {
  if (!endDateStr) return null
  try {
    const end = new Date(endDateStr)
    const now = new Date()
    const diff = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth())
    return diff > 0 ? diff : 0
  } catch {
    return null
  }
}

/**
 * Map ContractStatus sang nhãn hiển thị và màu sắc
 */
export const mapContractStatus = (status) => {
  switch (status) {
    case 'ACTIVE':
      return { label: 'ĐANG HIỆU LỰC', bgcolor: '#EAF3DE', color: '#27500A' }
    case 'ENDED':
      return { label: 'ĐÃ KẾT THÚC', bgcolor: '#F1EFE8', color: '#5F5E5A' }
    case 'PENDING':
      return { label: 'CHỜ KÝ', bgcolor: '#FFF7ED', color: '#92400E' }
    default:
      return { label: status ?? '—', bgcolor: '#f0f0f0', color: '#6b7280' }
  }
}
