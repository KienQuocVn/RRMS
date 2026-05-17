import httpClient from './httpClient'

//Motel-Service CRUD API

// CREATE - Tạo dịch vụ mới cho nhà trọ
export const createMotelService = async (data) => {
  const response = await httpClient.post('/api/v1/motel-services', data)
  return response.data
}

// READ - Lấy thông tin dịch vụ theo ID
export const getMotelServiceById = async (id) => {
  const response = await httpClient.get(`/api/v1/motel-services/${id}`)
  return response.data
}

// READ ALL - Lấy tất cả dịch vụ
export const getAllMotelServices = async () => {
  const response = await httpClient.get('/api/v1/motel-services')
  return response.data
}

// UPDATE - Cập nhật dịch vụ theo service ID
export const updateMotelService = async (id, data) => {
  const response = await httpClient.put(`/api/v1/motel-services/${id}`, data)
  return response.data
}

// UPDATE - Cập nhật dịch vụ theo motel ID
export const updateMotelServiceByMotelId = async (motelId, data) => {
  const response = await httpClient.put(`/api/v1/motel-services/motel/${motelId}`, data)
  return response.data
}

// DELETE - Xóa dịch vụ
export const deleteMotelServiceAPI = async (id) => {
  const response = await httpClient.delete(`/api/v1/motel-services/${id}`)
  return response.data
}

// Helper - Lấy danh sách dịch vụ của motel (thông qua motel detail)
export const getMotelDetail = async (motelId) => {
  const response = await httpClient.get(`/api/v1/motels/${motelId}`)
  return response.data
}

// Helper - Lấy danh sách phòng theo motel
export const getRoomsByMotelId = async (motelId) => {
  const response = await httpClient.get(`/api/v1/rooms/motel/${motelId}`)
  return response.data
}

// Backward compatibility aliases (tên cũ có typo)
export const createSerivceMotel = createMotelService
export const updateSerivceMotel = updateMotelService
export const updateSerivceMotelbyMotelId = updateMotelServiceByMotelId
