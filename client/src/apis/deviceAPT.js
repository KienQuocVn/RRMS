import httpClient from './httpClient'
export const getAllMotelDevices = async (data) => {
  const response = await httpClient.get(`/moteldevices/${data}`)
  return response.data
}
export const insertMotelDevice = async (data) => {
  const response = await httpClient.post('/moteldevices', data)
  return response.data
}
export const deleteMotelDevice = async (data) => {
  const response = await httpClient.delete(`/moteldevices/${data}`)
  return response.data
}
export const insertRoomDevice = async (data) => {
  const response = await httpClient.post('/roomdevices', data)
  return response.data
}
export const deleteRoomDevice = async (roomId, motel_device_id) => {
  const response = await httpClient.delete(`/roomdevices/${roomId}/${motel_device_id}`)
  return response.data
}
export const getAllDeviceByRomId = async (data) => {
  const response = await httpClient.get(`/roomdevices/${data}`)
  return response.data
}
export const changeQuantityRoomDevice = async (data) => {
  const response = await httpClient.post(
    `/roomdevices/${data.roomId}/${data.motel_device_id}/${data.quantity}`
  )
  return response.data
}
