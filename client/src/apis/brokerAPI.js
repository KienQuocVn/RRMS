import httpClient from './httpClient'

export const createBroker = async (data) => {
  return await httpClient.post('/broker', data)
}

export const getBrokers = async (motelId) => {
  return await httpClient.get(`/broker/${motelId}`)
}

export const updateBroker = async (brokerId, data) => {
  return await httpClient.put(`/broker/${brokerId}`, data)
}

export const deleteBroker = async (brokerId) => {
  return await httpClient.delete(`/broker/${brokerId}`)
}
