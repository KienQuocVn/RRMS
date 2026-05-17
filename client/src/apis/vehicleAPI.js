import axios from 'axios'

export const getVehiclesByMotelId = async (motelId) => {
  const response = await axios.get(`/cars/motel/${motelId}`)
  return response.data
}

export const createVehicle = async (vehicleData) => {
  const response = await axios.post('/cars', vehicleData)
  return response.data
}

export const updateVehicle = async (carId, vehicleData) => {
  const response = await axios.put(`/cars/${carId}`, vehicleData)
  return response.data
}

export const deleteVehicle = async (carId) => {
  const response = await axios.delete(`/cars/${carId}`)
  return response.data
}
