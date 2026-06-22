import httpClient from './httpClient'
import {
  extractEntityId,
  normalizeReservationResponse,
  toBackendContractStatus,
  unwrapApiResult
} from '~/utils/apiAdapters'

const normalizeReservationPayload = (data = {}) => {
  return {
    ...data,
    roomId: extractEntityId(data.roomId, ['roomId', 'id']),
    status: toBackendContractStatus(data.status)
  }
}

export const createReserveAPlace = async (data) => {
  try {
    const response = await httpClient.post('/room-reservations', normalizeReservationPayload(data))
    return normalizeReservationResponse(unwrapApiResult(response))
  } catch (error) {
    console.error('Error creating ReserveAPlace:', error)
    throw error
  }
}

export const getReserveAPlaceById = async (id) => {
  try {
    const reservationId = extractEntityId(id, ['reserveAPlaceId', 'roomReservationId', 'id'])
    const response = await httpClient.get(`/room-reservations/${reservationId}`)
    return normalizeReservationResponse(unwrapApiResult(response))
  } catch (error) {
    console.error('Error fetching ReserveAPlace by ID:', error)
    throw error
  }
}

export const getAllReserveAPlaces = async () => {
  try {
    const response = await httpClient.get('/room-reservations')
    return (unwrapApiResult(response, []) || []).map(normalizeReservationResponse)
  } catch (error) {
    console.error('Error fetching all ReserveAPlaces:', error)
    throw error
  }
}

export const updateReserveAPlace = async (id, data) => {
  try {
    const reservationId = extractEntityId(id, ['reserveAPlaceId', 'roomReservationId', 'id'])
    const response = await httpClient.put(
      `/room-reservations/${reservationId}`,
      normalizeReservationPayload(data)
    )
    return normalizeReservationResponse(unwrapApiResult(response))
  } catch (error) {
    console.error('Error updating ReserveAPlace:', error)
    throw error
  }
}

export const deleteReserveAPlace = async (id) => {
  try {
    const reservationId = extractEntityId(id, ['reserveAPlaceId', 'roomReservationId', 'id'])
    await httpClient.delete(`/room-reservations/${reservationId}`)
  } catch (error) {
    console.error('Error deleting ReserveAPlace:', error)
    throw error
  }
}

export const cancelReserveAPlace = async ({
  reservationId,
  refundAmount = 0,
  note = '',
  paymentMethod = '',
  roomName = '',
  tenantName = ''
}) => {
  const normalizedId = extractEntityId(reservationId, ['reserveAPlaceId', 'roomReservationId', 'id'])
  const refund = Number(refundAmount) || 0

  if (refund > 0) {
    const storedUser = sessionStorage.getItem('user')
    const user = storedUser ? JSON.parse(storedUser) : null
    const username = user?.username

    if (!username) {
      throw new Error('Không tìm thấy thông tin đăng nhập để ghi nhận hoàn cọc.')
    }

    const descriptionParts = [`Hoàn cọc giữ chỗ phòng ${roomName || ''}`.trim()]
    if (paymentMethod) descriptionParts.push(`PTTT: ${paymentMethod}`)
    if (note) descriptionParts.push(`Ghi chú: ${note}`)

    await httpClient.post(
      '/api/v1/transactions/expenses',
      {
        amount: refund,
        payerName: tenantName || 'Khách thuê',
        paymentDescription: descriptionParts.join(' - '),
        category: 'Chi hoàn cọc giữ chỗ',
        transactionDate: new Date().toISOString().split('T')[0]
      },
      { params: { username } }
    )
  }

  await deleteReserveAPlace(normalizedId)
}

export const getReserveAPlacesByRoomId = async (roomId) => {
  try {
    const normalizedRoomId = extractEntityId(roomId, ['roomId', 'id'])
    const response = await httpClient.get(`/room-reservations/room/${normalizedRoomId}`)
    return (unwrapApiResult(response, []) || []).map(normalizeReservationResponse)
  } catch (error) {
    console.error('Error fetching ReserveAPlaces by Room ID:', error)
    throw error
  }
}
