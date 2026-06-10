import httpClient from './httpClient'

const normalizeDateForApi = (value) => {
  if (!value) return null

  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return value
}

const buildTRCRequest = (TRC) => ({
  householdHead: TRC.householdHead ?? TRC.householdhead ?? '',
  representativeName: TRC.representativeName ?? TRC.representativename ?? '',
  phone: TRC.phone ?? '',
  birth: normalizeDateForApi(TRC.birth),
  permanentAddress: TRC.permanentAddress ?? TRC.permanentaddress ?? '',
  job: TRC.job ?? '',
  identifier: TRC.identifier ?? '',
  placeOfIssue: TRC.placeOfIssue ?? TRC.placeofissue ?? '',
  dateOfIssue: normalizeDateForApi(TRC.dateOfIssue ?? TRC.dateofissue),
  motelId: TRC.motelId ?? '',
  tenantUsername: TRC.tenantUsername ?? ''
})

const normalizeTRC = (TRC) => {
  if (!TRC) return TRC

  return {
    ...TRC,
    temporaryrcontractId: TRC.temporaryrcontractId ?? TRC.temporaryContractId ?? '',
    householdhead: TRC.householdhead ?? TRC.householdHead ?? '',
    representativename: TRC.representativename ?? TRC.representativeName ?? '',
    permanentaddress: TRC.permanentaddress ?? TRC.permanentAddress ?? '',
    placeofissue: TRC.placeofissue ?? TRC.placeOfIssue ?? '',
    dateofissue: TRC.dateofissue ?? TRC.dateOfIssue ?? ''
  }
}

const normalizeTRCResponse = (response) => {
  const result = response?.data?.result

  if (Array.isArray(result)) {
    response.data.result = result.map(normalizeTRC)
  } else if (result) {
    response.data.result = normalizeTRC(result)
  }

  return response
}

export const CreateTRC = async (TRC) => {
  const response = await httpClient.post('/temporary-contracts', buildTRCRequest(TRC))
  return normalizeTRCResponse(response)
}

export const getTRCByusername = async (username) => {
  if (!username) {
    throw new Error('username khong hop le')
  }
  const response = await httpClient.get(`/temporary-contracts/account?username=${username}`)
  return normalizeTRCResponse(response)
}

export const getTRCByMotelId = async (motelId) => {
  if (!motelId) {
    throw new Error('motelId khong hop le')
  }
  const response = await httpClient.get(`/temporary-contracts/motel/${motelId}`)
  return normalizeTRCResponse(response)
}

export const updateTRCById = async (id, TRC) => {
  if (!TRC || !id) {
    throw new Error('id va TRC khong hop le')
  }
  const response = await httpClient.put(`/temporary-contracts/${id}`, buildTRCRequest(TRC))
  return normalizeTRCResponse(response)
}
