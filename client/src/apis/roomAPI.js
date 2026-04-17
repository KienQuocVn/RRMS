import axios from 'axios'
import { env } from '~/configs/environment'
import httpClient from './httpClient'

//Room
export const getRoomByMotelId = async (id) => {
  const response = await httpClient.get(`/room/motel/${id}`)
  return response.data
}

export const createRoom = async (data) => {
  const response = await httpClient.post('/room', data)
  return response.data
}

export const getRoomById = async (id) => {
  const response = await httpClient.get(`/room/${id}`)
  return response.data
}

export const updateRoom = async (id, data) => {
  const response = await httpClient.put(`/room/${id}`, data)
  return response.data
}

export const updateContractStatus = async (roomId, newStatus, reportCloseDate) => {
  try {
    const response = await httpClient.put('/contracts/update-status', null, {
      params: { roomId, newStatus, reportCloseDate }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(error.response?.data?.message || 'Failed to update contract status')
  }
}

export const postRoom = async (data) => {
  return await httpClient.post('/room', data)
}

export const getPostRoomTable = async (username) => {
  return await httpClient.get(`/room/post-room-table?username=${username}`)
}

//Room Serivce
export const createRoomService = async (data) => {
  const response = await httpClient.post('/room-service', data)
  return response.data
}

export const getServiceRoombyRoomId = async (id) => {
  const response = await httpClient.get(`/room-service/room/${id}`)
  return response.data
}

export const DeleteRoomServiceByid = async (id) => {
  const response = await httpClient.delete(`/room-service/${id}`)
  return response.data
}

export const updateSerivceRoom = async (id, data) => {
  const response = await httpClient.put(`/room-service/${id}`, data)
  return response.data
}

export const DeleteRoomByid = async (id) => {
  const response = await httpClient.delete(`/room/${id}`)
  return response.data
}

export const getRoomByMotelIdWContract = async (id) => {
  const response = await httpClient.get(`/room/motel/W-Contract/${id}`)
  return response.data
}

export const getRoomByMotelIdYContract = async (id) => {
  const response = await httpClient.get(`/room/motel/Y-Contract/${id}`)
  return response.data
}
