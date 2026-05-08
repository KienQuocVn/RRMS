import httpClient from './httpClient'

// Bulletin Board
export const getBulletinBoard = async (id) => {
  const response = await httpClient.get(`/bulletin-board/${id}`)
  return response.data
}

export const getBulletinBoardTable = async (username) => {
  const response = await httpClient.get(`/bulletin-board/table/${username}`)
  return response.data
}

export const postBulletinBoard = async (data) => {
  const response = await httpClient.post('/bulletin-board', data)
  return response.data
}

export const updateBulletinBoard = async (id, data) => {
  const response = await httpClient.put(`/bulletin-board/${id}`, data)
  return response.data
}

export const deleteBulletinBoard = async (id) => {
  const response = await httpClient.delete(`/bulletin-board/${id}`)
  return response.data
}

export const searchBulletinBoardByAddress = async (address) => {
  const response = await httpClient.get(`/api/v1/bulletin-boards/search?address=${address}`)
  return response.data
}
