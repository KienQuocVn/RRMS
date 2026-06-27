import httpClient from './httpClient'

export const createMotel = async (Motel) => {
  return await httpClient.post('/api/v1/motels', Motel)
}
export const getMotelByname = async (motelName) => {
  return await httpClient.get(`/api/v1/motels/${motelName}`)
}
export const updateMotel = async (motelId, Motel) => {
  return await httpClient.put(`/api/v1/motels/${motelId}`, Motel)
}
export const deleteMotel = async (motelId) => {
  return await httpClient.delete(`/api/v1/motels/${motelId}`)
}

export const getMotelByUsername = async (username) => {
  return await httpClient.get(`/api/v1/motels/account/${username}`)
}

export const getMotelById = async (Id) => {
  return await httpClient.get(`/api/v1/motels/${Id}`)
}

export const getMotelAreaSummary = async (motelId) => {
  return await httpClient.get(`/api/v1/motels/${motelId}/area-summary`)
}
