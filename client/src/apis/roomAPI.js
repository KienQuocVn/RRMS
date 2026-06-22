import httpClient from './httpClient'
import {
  extractEntityId,
  normalizeRoomCollection,
  normalizeRoomPayload,
  normalizeRoomResponse,
  normalizeRoomServiceCollection,
  toBackendContractStatus,
  unwrapApiResult
} from '~/utils/apiAdapters'

//Room
export const getRoomByMotelId = async (id) => {
  const motelId = extractEntityId(id, ['motelId', 'id'])
  if (!motelId) return []

  const response = await httpClient.get(`/api/v1/rooms/motel/${motelId}`)
  return normalizeRoomCollection(unwrapApiResult(response, []))
}

export const createRoom = async (data) => {
  const response = await httpClient.post('/api/v1/rooms', normalizeRoomPayload(data))
  return unwrapApiResult(response)
}

export const getRoomById = async (id) => {
  const roomId = extractEntityId(id, ['roomId', 'id'])
  if (!roomId) return null

  const response = await httpClient.get(`/api/v1/rooms/${roomId}`)
  return normalizeRoomResponse(unwrapApiResult(response))
}

export const updateRoom = async (id, data) => {
  const roomId = extractEntityId(id, ['roomId', 'id'])
  const response = await httpClient.put(`/api/v1/rooms/${roomId}`, normalizeRoomPayload(data))
  return unwrapApiResult(response)
}

export const updateContractStatus = async (roomId, newStatus, reportCloseDate) => {
  try {
    const normalizedRoomId = extractEntityId(roomId, ['roomId', 'id'])
    const response = await httpClient.put('/contracts/update-status', null, {
      params: {
        roomId: normalizedRoomId,
        newStatus: toBackendContractStatus(newStatus),
        reportCloseDate
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(error.response?.data?.message || 'Failed to update contract status')
  }
}

export const postRoom = async (data) => {
  return await httpClient.post('/api/v1/rooms', normalizeRoomPayload(data))
}

export const getPostRoomTable = async (username) => {
  return await httpClient.get(`/api/v1/rooms/post-room-table?username=${username}`)
}

//Room Serivce
export const createRoomService = async (data) => {
  const response = await httpClient.post('/api/v1/room-services', data)
  return unwrapApiResult(response)
}

export const getServiceRoombyRoomId = async (id) => {
  const roomId = extractEntityId(id, ['roomId', 'id'])
  if (!roomId) return []

  const response = await httpClient.get(`/api/v1/room-services/room/${roomId}`)
  return normalizeRoomServiceCollection(unwrapApiResult(response, []))
}

export const DeleteRoomServiceByid = async (id) => {
  const response = await httpClient.delete(`/api/v1/room-services/${id}`)
  return response.data
}

export const updateSerivceRoom = async (id, data) => {
  const response = await httpClient.put(`/api/v1/room-services/${id}`, data)
  return unwrapApiResult(response)
}

export const DeleteRoomByid = async (id) => {
  const roomId = extractEntityId(id, ['roomId', 'id'])
  const response = await httpClient.delete(`/api/v1/rooms/${roomId}`)
  return response.data
}

export const getRoomByMotelIdWContract = async (id) => {
  const motelId = extractEntityId(id, ['motelId', 'id'])
  if (!motelId) return []

  const response = await httpClient.get(`/api/v1/rooms/motel/${motelId}/with-contract`)
  return normalizeRoomCollection(unwrapApiResult(response, []))
}

export const getRoomByMotelIdYContract = async (id) => {
  const motelId = extractEntityId(id, ['motelId', 'id'])
  if (!motelId) return []

  const response = await httpClient.get(`/api/v1/rooms/motel/${motelId}/without-contract`)
  return normalizeRoomCollection(unwrapApiResult(response, []))
}
