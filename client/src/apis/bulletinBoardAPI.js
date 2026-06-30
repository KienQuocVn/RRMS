import httpClient from './httpClient'
import publicHttpClient from './publicHttpClient'

// Bulletin Board
export const getBulletinBoard = async (id) => {
  const response = await publicHttpClient.get(`/api/v1/bulletin-boards/${id}`)
  return response.data
}

export const getBulletinBoardTable = async (username) => {
  const response = await httpClient.get(`/api/v1/bulletin-boards/table/${username}`)
  return response.data
}

export const postBulletinBoard = async (data) => {
  const response = await httpClient.post('/api/v1/bulletin-boards', data)
  return response.data
}

export const updateBulletinBoard = async (id, data) => {
  const response = await httpClient.put(`/api/v1/bulletin-boards/${id}`, data)
  return response.data
}

export const deleteBulletinBoard = async (id) => {
  const response = await httpClient.delete(`/api/v1/bulletin-boards/${id}`)
  return response.data
}

export const getInactiveBulletinBoards = async () => {
  const response = await httpClient.get('/api/v1/bulletin-boards/inactive')
  return response.data
}

export const getAllBulletinBoards = async () => {
  const response = await httpClient.get('/api/v1/bulletin-boards')
  return response.data
}

export const approveBulletinBoard = async (id) => {
  const response = await httpClient.put(`/api/v1/bulletin-boards/${id}/approve`)
  return response.data
}

export const rejectBulletinBoard = async (id, reason) => {
  const response = await httpClient.put(`/api/v1/bulletin-boards/${id}/reject`, { reason })
  return response.data
}

export const hideBulletinBoard = async (id) => {
  const response = await httpClient.put(`/api/v1/bulletin-boards/${id}/hide`)
  return response.data
}

export const searchBulletinBoardByAddress = async (address) => {
  const response = await publicHttpClient.get(`/api/v1/bulletin-boards/search?address=${address}`)
  return response.data
}
