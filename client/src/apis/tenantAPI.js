import httpClient from './httpClient'

export const getByIdTenant = async (editId) => {
  const response = await httpClient.get(`/tenant/tenant-id?id=${editId}`)
  return response.data
}

//delete
export const deleteTenant = async (tenantId) => {
  const response = await httpClient.delete(`/tenant/room/${tenantId}`)
  return response.data
}

export const updateTenant = async (id, tenant) => {
  try {
    const response = await httpClient.put(`/tenant/${id}`, tenant)
    return response.data
  } catch (error) {
    console.error('Error updating tenant:', error.response?.data || error.message)
    throw error
  }
}
