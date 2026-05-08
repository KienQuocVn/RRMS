import { unwrapApiResult } from '~/utils/apiAdapters'
import httpClient from './httpClient'

const PROFILE_BASE_PATH = '/api/v1/accounts/profile'

const getStoredUsername = () => {
  const storedUser = sessionStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser)?.username ?? '' : ''
}

const normalizeRoleList = (profile = {}) => {
  if (Array.isArray(profile.role)) return profile.role
  if (Array.isArray(profile.roles)) return profile.roles
  if (profile.role) return [profile.role]
  return []
}

export const normalizeProfileResponse = (profile = {}) => {
  const fullName = profile.fullName ?? profile.fullname ?? ''
  const role = normalizeRoleList(profile)
  const permissions = Array.isArray(profile.permissions) ? profile.permissions : []

  return {
    ...profile,
    fullName,
    fullname: fullName,
    phone: profile.phone ?? '',
    email: profile.email ?? '',
    birthday: profile.birthday ?? null,
    gender: profile.gender ?? '',
    cccd: profile.cccd ?? '',
    avatar: profile.avatar ?? '',
    role,
    roles: Array.isArray(profile.roles) ? profile.roles : role,
    permissions
  }
}

export const buildProfilePayload = (profile = {}) => {
  const normalizedProfile = normalizeProfileResponse(profile)

  return {
    username: normalizedProfile.username ?? '',
    password: normalizedProfile.password ?? null,
    fullName: normalizedProfile.fullName,
    phone: normalizedProfile.phone,
    email: normalizedProfile.email,
    birthday: normalizedProfile.birthday || null,
    gender: normalizedProfile.gender || null,
    cccd: normalizedProfile.cccd,
    avatar: normalizedProfile.avatar,
    role: normalizedProfile.role,
    permissions: normalizedProfile.permissions
  }
}

export const getProfile = async (username) => {
  const effectiveUsername = username || getStoredUsername()

  const response = await httpClient.get(PROFILE_BASE_PATH, {
    params: { username: effectiveUsername }
  })

  return normalizeProfileResponse(unwrapApiResult(response, {}))
}

export const updateProfile = async (data) => {
  const response = await httpClient.put(PROFILE_BASE_PATH, buildProfilePayload(data))

  return normalizeProfileResponse(unwrapApiResult(response, data))
}

export const changePassword = async ({ username, oldPassword, newPassword }) => {
  return await httpClient.put(`${PROFILE_BASE_PATH}/change-password`, {
    username: username || getStoredUsername(),
    oldPassword,
    newPassword
  })
}
