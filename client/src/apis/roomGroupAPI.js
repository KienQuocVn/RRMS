import httpClient from './httpClient'
import { extractEntityId, unwrapApiResult } from '~/utils/apiAdapters'

export const getRoomGroupsByMotelId = async (motelId) => {
  const normalizedMotelId = extractEntityId(motelId, ['motelId', 'id'])
  if (!normalizedMotelId) return []

  const response = await httpClient.get(`/api/v1/motel-room-groups/motel/${normalizedMotelId}`)
  return unwrapApiResult(response, [])
}

export const createRoomGroup = async (data) => {
  const response = await httpClient.post('/api/v1/motel-room-groups', data)
  return unwrapApiResult(response)
}

export const deleteRoomGroup = async (id) => {
  const roomGroupId = extractEntityId(id, ['roomGroupId', 'id'])
  const response = await httpClient.delete(`/api/v1/motel-room-groups/${roomGroupId}`)
  return unwrapApiResult(response)
}
