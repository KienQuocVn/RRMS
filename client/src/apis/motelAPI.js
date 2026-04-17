import httpClient from './httpClient'

export const createMotel = async (Motel) => {
  return await httpClient.post('/motels/create', Motel)
}
export const getMotelByname = async (motelName) => {
  return await httpClient.get(`/motels/${motelName}`)
}
export const updateMotel = async (motelId, Motel) => {
  return await httpClient.put(`/motels/${motelId}`, Motel)
}
export const deleteMotel = async (motelId) => {
  return await httpClient.delete(`/motels/${motelId}`)
}

export const getMotelByUsername = async (username) => {
  return await httpClient.get(`/motels/get-motel-account?username=${username}`)
}

export const getMotelById = async (Id) => {
  return await httpClient.get(`/motels/get-motel-id?id=${Id}`)
}

