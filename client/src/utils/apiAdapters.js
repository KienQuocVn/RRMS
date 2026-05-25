const INVALID_ROUTE_PARAM_VALUES = new Set(['', 'undefined', 'null'])

export const isValidRouteParam = (value) => {
  if (value === null || value === undefined) return false
  return !INVALID_ROUTE_PARAM_VALUES.has(String(value).trim())
}

export const unwrapApiResult = (response, fallback = null) => {
  if (response?.data?.result !== undefined) {
    return response.data.result
  }

  return fallback
}

export const unwrapPageItems = (response) => {
  return response?.data?.result?.items ?? []
}

const LEGACY_TO_BACKEND_CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  EXPIRING: 'EXPIRING',
  TERMINATED: 'TERMINATED',
  DEPOSITED: 'DEPOSITED',
  IATExpire: 'EXPIRING',
  ReportEnd: 'TERMINATED',
  Stake: 'DEPOSITED'
}

const BACKEND_TO_LEGACY_CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  EXPIRING: 'IATExpire',
  TERMINATED: 'ReportEnd',
  DEPOSITED: 'Stake'
}

export const extractEntityId = (
  value,
  candidateKeys = ['roomId', 'motelId', 'contractId', 'carId', 'tenantId', 'reserveAPlaceId', 'id']
) => {
  if (isValidRouteParam(value) && typeof value !== 'object') {
    return String(value).trim()
  }

  if (!value || typeof value !== 'object') return null

  for (const key of candidateKeys) {
    const candidateValue = value[key]
    if (isValidRouteParam(candidateValue) && typeof candidateValue !== 'object') {
      return String(candidateValue).trim()
    }
  }

  return null
}

export const toBackendContractStatus = (status) => {
  if (!status) return status
  return LEGACY_TO_BACKEND_CONTRACT_STATUS[status] ?? status
}

export const toLegacyContractStatus = (status) => {
  if (!status) return status
  return BACKEND_TO_LEGACY_CONTRACT_STATUS[status] ?? status
}

export const normalizeContractResponse = (contract = null) => {
  if (!contract) return null

  return {
    ...contract,
    roomId: contract.roomId ?? contract.room?.roomId ?? null,
    tenantId: contract.tenantId ?? contract.tenant?.tenantId ?? null,
    contracttemplate: contract.contracttemplate ?? contract.contractTemplate ?? null,
    contractTemplate: contract.contractTemplate ?? contract.contracttemplate ?? null,
    moveinDate: contract.moveinDate ?? contract.moveInDate ?? null,
    moveInDate: contract.moveInDate ?? contract.moveinDate ?? null,
    collectioncycle: contract.collectioncycle ?? contract.collectionCycle ?? '',
    collectionCycle: contract.collectionCycle ?? contract.collectioncycle ?? '',
    createdate: contract.createdate ?? contract.createDate ?? null,
    createDate: contract.createDate ?? contract.createdate ?? null,
    signcontract: contract.signcontract ?? contract.signContract ?? '',
    signContract: contract.signContract ?? contract.signcontract ?? '',
    reportCloseDate: contract.reportCloseDate ?? contract.reportCloseContract ?? null,
    reportCloseContract: contract.reportCloseContract ?? contract.reportCloseDate ?? null,
    status: toLegacyContractStatus(contract.status)
  }
}

export const normalizeReservationResponse = (reservation = null) => {
  if (!reservation) return null

  return {
    ...reservation,
    reserveAPlaceId: reservation.reserveAPlaceId ?? reservation.roomReservationId ?? null,
    roomReservationId: reservation.roomReservationId ?? reservation.reserveAPlaceId ?? null,
    moveinDate: reservation.moveinDate ?? reservation.moveInDate ?? null,
    moveInDate: reservation.moveInDate ?? reservation.moveinDate ?? null,
    status: toLegacyContractStatus(reservation.status)
  }
}

export const normalizeRoomResponse = (room = null) => {
  if (!room) return null

  const normalizedReservation = normalizeReservationResponse(room.roomReservation ?? room.reserveAPlace)

  return {
    ...room,
    latestContract: normalizeContractResponse(room.latestContract),
    roomReservation: normalizedReservation,
    reserveAPlace: normalizedReservation
  }
}

export const normalizeRoomCollection = (rooms = []) => {
  if (!Array.isArray(rooms)) return []
  return rooms.map(normalizeRoomResponse)
}

const toNumberOrUndefined = (value) => {
  if (value === '' || value === null || value === undefined) return undefined

  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const trimToNull = (value) => {
  if (value === null || value === undefined) return null

  const normalized = String(value).trim()
  return normalized === '' ? null : normalized
}

const ROOM_STATUS_MAP = {
  available: 'AVAILABLE',
  available_room: 'AVAILABLE',
  'con trong': 'AVAILABLE',
  'còn trống': 'AVAILABLE',
  occupied: 'OCCUPIED',
  rented: 'OCCUPIED',
  active: 'OCCUPIED',
  'đang ở': 'OCCUPIED',
  maintenance: 'MAINTENANCE',
  'bao tri': 'MAINTENANCE',
  'bảo trì': 'MAINTENANCE',
  reserved: 'RESERVED',
  booking: 'RESERVED',
  'giu cho': 'RESERVED',
  'giữ chỗ': 'RESERVED'
}

export const normalizeRoomPayload = (room = {}) => {
  const normalizedStatusKey = String(room.status ?? '').trim().toLowerCase()

  return {
    motelId: room.motelId,
    name: room.name ?? '',
    group: room.group ?? '',
    price: toNumberOrUndefined(room.price),
    prioritize: room.prioritize ?? '',
    area: toNumberOrUndefined(room.area),
    deposit: toNumberOrUndefined(room.deposit),
    status: ROOM_STATUS_MAP[normalizedStatusKey] ?? 'AVAILABLE',
    finance: room.finance ?? '',
    description: room.description ?? room.note ?? ''
  }
}

export const normalizeTenantPayload = (tenant = {}) => {
  return {
    avatar: trimToNull(tenant.avatar),
    fullName: trimToNull(tenant.fullName ?? tenant.fullname) ?? '',
    phone: trimToNull(tenant.phone),
    cccd: trimToNull(tenant.cccd),
    email: trimToNull(tenant.email),
    birthday: tenant.birthday || null,
    gender: tenant.gender || null,
    address: trimToNull(tenant.address),
    job: trimToNull(tenant.job),
    licenseDate: tenant.licenseDate || null,
    placeOfLicense: trimToNull(tenant.placeOfLicense),
    frontPhoto: trimToNull(tenant.frontPhoto),
    backPhoto: trimToNull(tenant.backPhoto),
    role: tenant.role ?? false,
    relationship: trimToNull(tenant.relationship),
    typeOfTenant: tenant.typeOfTenant ?? tenant.type_of_tenant ?? false,
    temporaryResidence: tenant.temporaryResidence ?? false,
    informationVerify: tenant.informationVerify ?? false
  }
}

export const normalizeContractPayload = (contract = {}) => {
  const normalizedRoomId = extractEntityId(contract.roomId, ['roomId', 'id'])
  const normalizedTenantId = extractEntityId(contract.tenantId, ['tenantId', 'id'])
  const normalizedContractTemplateId = extractEntityId(
    contract.contractTemplateId ?? contract.contracttemplateId,
    ['contractTemplateId', 'contracttemplateId', 'id']
  )
  const normalizedBrokerId = extractEntityId(contract.brokerId, ['brokerId', 'id'])

  return {
    roomId: normalizedRoomId,
    tenantId: normalizedTenantId,
    username: trimToNull(contract.username),
    contractTemplateId: normalizedContractTemplateId,
    brokerId: normalizedBrokerId,
    moveInDate: contract.moveInDate ?? contract.moveinDate ?? null,
    leaseTerm: trimToNull(contract.leaseTerm),
    closeContract: contract.closeContract ?? null,
    description: trimToNull(contract.description),
    debt: toNumberOrUndefined(contract.debt) ?? 0,
    price: toNumberOrUndefined(contract.price),
    actualPrice: toNumberOrUndefined(contract.actualPrice),
    deposit: toNumberOrUndefined(contract.deposit),
    collectionCycle: trimToNull(contract.collectionCycle ?? contract.collectioncycle) ?? '1',
    createDate: contract.createDate ?? contract.createdate ?? new Date().toISOString().slice(0, 10),
    signContract: trimToNull(contract.signContract ?? contract.signcontract) ?? 'Khach chua ky',
    language: trimToNull(contract.language) ?? 'Tieng Viet',
    countTenant: toNumberOrUndefined(contract.countTenant) ?? 1,
    status: toBackendContractStatus(contract.status ?? 'ACTIVE'),
    reportCloseContract: contract.reportCloseContract ?? contract.reportCloseDate ?? null
  }
}
