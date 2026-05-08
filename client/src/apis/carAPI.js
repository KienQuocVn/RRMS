import httpClient from './httpClient'
import { extractEntityId } from '~/utils/apiAdapters'

export const createCar = async (Car) => {
  return await httpClient.post('/cars', Car)
}

export const updateCar = async (carId, car) => {
  const normalizedCarId = extractEntityId(carId, ['carId', 'id'])
  return await httpClient.put(`/cars/${normalizedCarId}`, car)
}
export const deleteCar = async (carId) => {
  const normalizedCarId = extractEntityId(carId, ['carId', 'id'])
  return await httpClient.delete(`/cars/${normalizedCarId}`)
}

export const getCarByRoomId = async (roomId) => {
  const normalizedRoomId = extractEntityId(roomId, ['roomId', 'id'])
  if (!normalizedRoomId) return []

  const response = await httpClient.get(`/cars/room/${normalizedRoomId}`)
  return Array.isArray(response.data) ? response.data : []
}

export const getCarByCarId = async (carId) => {
  const normalizedCarId = extractEntityId(carId, ['carId', 'id'])
  return await httpClient.get(`/cars/${normalizedCarId}`)
}
