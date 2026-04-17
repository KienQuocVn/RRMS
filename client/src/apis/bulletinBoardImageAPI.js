import httpClient from './httpClient'

export const deleteImageFromApi = async (id) => {
  const response = await httpClient.delete(`/bulletin-board-image/${id}`)
  return response.data
}
