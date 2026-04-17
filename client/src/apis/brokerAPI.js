import httpClient from './httpClient'

export const createBroker = async (data) => {
  return await httpClient.post('/broker', data)
}

export const getBrokers = async (motelId) => {
  return await httpClient.get(`/broker/${motelId}`)
}
