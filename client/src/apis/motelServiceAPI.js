import httpClient from './httpClient'

//Motel-Service
export const createSerivceMotel = async (data) => {
  const response = await httpClient.post('/motel-services/create', data)
  return response.data
}

export const updateSerivceMotel = async (id, data) => {
  const response = await httpClient.put(`/motel-services/${id}`, data)
  return response.data
}

export const updateSerivceMotelbyMotelId = async (id, data) => {
  const response = await httpClient.put(`/motel-services/update-by-motel/${id}`, data)
  return response.data
}
