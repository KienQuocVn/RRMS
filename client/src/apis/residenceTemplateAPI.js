import httpClient from './httpClient'

// Tạo mới mẫu tờ khai tạm trú
export const createResidenceTemplate = async (data) => {
  const response = await httpClient.post('/residence-templates', data)
  return response.data
}

// Lấy mẫu tờ khai theo ID
export const getResidenceTemplateById = async (id) => {
  const response = await httpClient.get(`/residence-templates/${id}`)
  return response.data
}

// Lấy tất cả mẫu tờ khai
export const getAllResidenceTemplates = async () => {
  const response = await httpClient.get('/residence-templates')
  return response.data
}

// Lấy danh sách mẫu tờ khai theo Motel ID
export const getResidenceTemplatesByMotelId = async (motelId) => {
  const response = await httpClient.get(`/residence-templates/motel/${motelId}`)
  return response.data
}

// Cập nhật mẫu tờ khai
export const updateResidenceTemplate = async (id, data) => {
  const response = await httpClient.put(`/residence-templates/${id}`, data)
  return response.data
}

// Xóa mẫu tờ khai
export const deleteResidenceTemplate = async (id) => {
  await httpClient.delete(`/residence-templates/${id}`)
}
