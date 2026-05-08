import httpClient from './httpClient'

//Motel-Service
export const createSerivceMotel = async (data) => {
  const response = await httpClient.post('/api/v1/motel-services', data)
  return response.data
}

export const updateSerivceMotel = async (id, data) => {
  const response = await httpClient.put(`/api/v1/motel-services/${id}`, data)
  return response.data
}

export const updateSerivceMotelbyMotelId = async (id, data) => {
  const response = await httpClient.put(`/api/v1/motel-services/motel/${id}`, data)
  return response.data
}
