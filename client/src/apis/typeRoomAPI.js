import httpClient from './httpClient'

//type room
//lay danh sach type room
export const getAllTypeRoom = async () => {
  const response = await httpClient.get('/type-rooms')
  return response.data
}
