import httpClient from './httpClient'
import { normalizeTenantPayload, unwrapApiResult } from '~/utils/apiAdapters'

export const getTenantsByRoomId = async (roomId) => {
  const response = await httpClient.get(`/tenant/roomId/${roomId}`)
  const tenants = unwrapApiResult(response, [])
  return Array.isArray(tenants) ? tenants : []
}

export const getByIdTenant = async (editId) => {
  const response = await httpClient.get(`/tenant/tenant-id?id=${editId}`)
  return response.data
}

//delete
export const deleteTenant = async (tenantId) => {
  const response = await httpClient.delete(`/tenant/room/${tenantId}`)
  return response.data
}

export const deleteTenantById = async (tenantId) => {
  const response = await httpClient.delete(`/tenant/${tenantId}`)
  return response.data
}

export const updateTenant = async (id, tenant) => {
  try {
    const response = await httpClient.put(`/tenant/${id}`, normalizeTenantPayload(tenant))
    return response.data
  } catch (error) {
    console.error('Error updating tenant:', error.response?.data || error.message)
    throw error
  }
}

export const getTenantDashboard = async (username) => {
  try {
    const url = username ? `/tenant/dashboard?username=${encodeURIComponent(username)}` : '/tenant/dashboard'
    const response = await httpClient.get(url)
    return unwrapApiResult(response, null)
  } catch (error) {
    console.error('Error fetching tenant dashboard:', error)
    return null
  }
}

