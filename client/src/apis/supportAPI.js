import httpClient from './httpClient'
export const insertSupport = async (data) => {
  const response = await httpClient.post('/support/create', data)
  return response.data
}
export const getAllSupport = async () => {
  const response = await httpClient.get('/support/getAll')
  return response.data
}
