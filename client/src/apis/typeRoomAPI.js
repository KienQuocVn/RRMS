import httpClient from './httpClient'

//type room
//lay danh sach type room
export const getAllTypeRoom = async () => {
  const response = await httpClient.get('/api/v1/type-rooms')
  return response.data
}
