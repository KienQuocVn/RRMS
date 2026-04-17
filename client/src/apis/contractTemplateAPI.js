import dayjs from 'dayjs' // Sử dụng thư viện dayjs để định dạng ngày
import httpClient from './httpClient'

// muc mau hop dong
// Tạo mới một Contract Template
export const createContractTemplate = async (data) => {
  const response = await httpClient.post('/contract-templates', data)
  return response.data
}

// Lấy thông tin của một Contract Template theo ID
export const getContractTemplateById = async (id) => {
  const response = await httpClient.get(`/contract-templates/${id}`)
  return response.data
}



// Lấy danh sách tất cả Contract Templates
export const getAllContractTemplates = async () => {
  const response = await httpClient.get('/contract-templates')
  return response.data
}

// Lấy danh sách Contract Templates theo Motel ID
export const getContractTemplatesByMotelId = async (motelId) => {
  const response = await httpClient.get(`/contract-templates/motel/${motelId}`)
  return response.data
}

// Cập nhật thông tin của một Contract Template
export const updateContractTemplate = async (id, data) => {
  const response = await httpClient.put(`/contract-templates/${id}`, data)
  return response.data
}

// Xóa một Contract Template theo ID
export const deleteContractTemplate = async (id) => {
  await httpClient.delete(`/contract-templates/${id}`)
}

// ---------------------------------------- hop dong

//update hop dong
export const updateContractDetail = async (ContractId,roomId, deposit, price,debt) => {
  try {
    const response = await httpClient.put('/contracts/update-contract', null, {
      params: { ContractId, roomId, deposit, price, debt }
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update contract status'
    )
  }
}


//update trang thai hop dong khi sap het han
export const updateContractStatusClose = async (newStatus,thresholdDays) => {
  try {
    const response = await httpClient.put('/contracts/update-status-by-days-difference', null, {
      params: { newStatus, thresholdDays }
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update contract status'
    )
  }
}

//update trang thai hop dong khi sap het han
export const updateContractStatusClose2 = async (newStatus,thresholdDays) => {
  try {
    const response = await httpClient.put('/contracts/update-status-by-days-difference2', null, {
      params: { newStatus, thresholdDays }
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update contract status'
    )
  }
}

//update trang thai hop dong khi sap het han
export const updateExtendContractStatusClose = async (contractId, newCloseContract) => {
  try {
    // Định dạng ngày thành dd-MM-yyyy trước khi gửi
 
    const formattedDate = dayjs(newCloseContract).format('DD-MM-YYYY')

    const response = await httpClient.put('/contracts/update-close-contract', null, {
      params: { contractId, newCloseContract: formattedDate }
    })

    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update contract status'
    )
  }
}

// Xóa hợp đồng
export const deleteContract = async (id) => {
  await httpClient.delete(`/contracts/${id}`)
}

// Xóa hợp đồng theo roomId
export const deleteContractByRoomId = async (id) => {
  await httpClient.delete(`/contracts/room/${id}`)
}

// Tạo hợp đồng
export const createContract = async (contractData) => {
  const response = await httpClient.post('/contracts', contractData)
  return response.data
}

// Lấy hợp đồng theo ID
export const getContractById = async (id) => {
  const response = await httpClient.get(`/contracts/${id}`)
  return response.data
}

// Lấy hợp đồng theo ID Room
export const getContractByIdRoom = async (roomId) => {
  const response = await httpClient.get(`/contracts/room/${roomId}`)
  return response.data
}

// Lấy hợp đồng theo ID Room
export const getContractByIdRoom2= async (roomId) => {
  const response = await httpClient.get(`/contracts/room/${roomId}`)
  return response.data
}

// Lấy hợp đồng theo ID motel
export const getContractByIdMotel = async (motelId) => {
  const response = await httpClient.get(`/contracts/motel/${motelId}`)
  return response.data
}

// Cập nhật hợp đồng
export const updateContract = async (id, contractData) => {
  const response = await httpClient.put(`/contracts/${id}`, contractData)
  return response.data
}

// ---------------------------------------- hop dong dich vu

// Tạo mới ContractService
export const createContractService = async (contractServiceData) => {
  const response = await httpClient.post('/contract-service', contractServiceData)
  return response.data
}

// Cập nhật ContractService theo ID
export const updateContractService = async (id, contractServiceData) => {
  const response = await httpClient.put(`/contract-service/${id}`, contractServiceData)
  return response.data
}

// Xóa ContractService theo ID
export const deleteContractService = async (id) => {
  await httpClient.delete(`/contract-service/${id}`)
}

// Lấy ContractService theo ID
export const getContractServiceById = async (id) => {
  const response = await httpClient.get(`/contract-service/${id}`)
  return response.data
}

// Lấy danh sách tất cả ContractService
export const getAllContractServices = async () => {
  const response = await httpClient.get('/contract-service')
  return response.data
}


// ---------------------------------------- hop dong tai san
// Tạo mới ContractDevice
export const createContractDevice = async (contractDeviceData) => {
  const response = await httpClient.post('/contract-device', contractDeviceData)
  return response.data
}

// Cập nhật ContractDevice theo ID
export const updateContractDevice = async (id, contractDeviceData) => {
  const response = await httpClient.put(`/contract-device/${id}`, contractDeviceData)
  return response.data
}

// Xóa ContractDevice theo ID
export const deleteContractDevice = async (id) => {
  await httpClient.delete(`/contract-device/${id}`)
}

// Lấy ContractDevice theo ID
export const getContractDeviceById = async (id) => {
  const response = await httpClient.get(`/contract-device/${id}`)
  return response.data
}

// Lấy danh sách tất cả ContractDevices
export const getAllContractDevices = async () => {
  const response = await httpClient.get('/contract-device')
  return response.data
}


//-------------------------insert tenant

export const createTenant = async (roomId,data) => {
  const response = await httpClient.post(`/tenant/insert/${roomId}`, data)
  return response.data
}
