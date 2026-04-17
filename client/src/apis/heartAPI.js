import httpClient from './httpClient'

export const getHeartByUsername = async (data) => {
  return await httpClient.get(`/hearts/${data}`)
}
export const insertHeart = async (username, idbull) => {
  const response = await httpClient.post(`/hearts/${username}/${idbull}`, {})
  return response.data
}
export const deleteHeart = async (username, idbull) => {
  const response = await httpClient.delete(`/hearts/removeHeart/${username}/${idbull}`)
  return response.data
}
