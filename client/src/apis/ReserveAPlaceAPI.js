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
