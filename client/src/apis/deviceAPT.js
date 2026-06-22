import httpClient from './httpClient'
export const getAllMotelDevices = async (data) => {
  const response = await httpClient.get(`/api/v1/motel-devices/motel/${data}`)
  return response.data
}
export const insertMotelDevice = async (data) => {
  const response = await httpClient.post('/api/v1/motel-devices', data)
  return response.data
}
export const deleteMotelDevice = async (data) => {
  const response = await httpClient.delete(`/api/v1/motel-devices/${data}`)
  return response.data
}
export const updateMotelDevice = async (motelDeviceId, data) => {
  const response = await httpClient.put(`/api/v1/motel-devices/${motelDeviceId}`, data)
  return response.data
}
export const insertRoomDevice = async (data) => {
  const response = await httpClient.post('/api/v1/room-devices', data)
  return response.data
}
export const deleteRoomDevice = async (roomId, motel_device_id) => {
  const response = await httpClient.delete(`/api/v1/room-devices/${roomId}/devices/${motel_device_id}`)
  return response.data
}
export const getAllDeviceByRomId = async (data) => {
  const response = await httpClient.get(`/api/v1/room-devices/${data}`)
  return response.data
}
export const changeQuantityRoomDevice = async (data) => {
  const response = await httpClient.put(`/api/v1/room-devices/${data.roomId}/devices/${data.motel_device_id}`, null, {
    params: { quantity: data.quantity }
  })
  return response.data
}
