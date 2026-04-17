import httpClient from './httpClient'

export const createCar = async (Car) => {
  return await httpClient.post('/cars', Car)
}

export const updateCar = async (carId, car) => {
  return await httpClient.put(`/cars/${carId}`, car)
}
export const deleteCar = async (carId) => {
  return await httpClient.delete(`/cars/${carId}`)
}

export const getCarByRoomId = async (roomId) => {
  return await httpClient.get(`/cars/room/${roomId}`)
}

export const getCarByCarId = async (carId) => {
  return await httpClient.get(`/cars/${carId}`)
}