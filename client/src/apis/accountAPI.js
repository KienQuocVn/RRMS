import { unwrapApiResult } from '~/utils/apiAdapters'
import httpClient from './httpClient'

export const getStoredAuthUser = () => {
  const storedUser = sessionStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

export const getAccountByUsername = async (username) => {
  const response = await httpClient.get(`/api-accounts/${username}`)
  return unwrapApiResult(response, null)
}

export const introspect = async () => {
  const user = getStoredAuthUser()
  const response = await httpClient.post('/authen/introspect', { token: user?.token ?? null })
  return unwrapApiResult(response, null)
}

export const logout = async (token) => {
  const user = getStoredAuthUser()
  const effectiveToken = token ?? user?.token ?? null

  if (!effectiveToken) {
    throw new Error('Missing auth token')
  }

  const response = await httpClient.post('/authen/logout', { token: effectiveToken })
  return response.data
}

export const email_valid = async (email) => {
  const response = await httpClient.get(`/authen/checkMail?email=${email}`)
  return response.data
}
export const sendOTP = async (data) => {
  const response = await httpClient.post('/authen/forgetpassword', data)
  return response.data
}
export const acceptChangePassword = async (data) => {
  const response = await httpClient.post('/authen/acceptChangePassword', data)
  return response.data
}

export const checkRegister = async (data) => {
  const response = await httpClient.post(`/authen/checkregister/${data}`)
  return response.data
}
export const sendOTPRegister = async (data) => {
  const response = await httpClient.post('/authen/authenticationRegister', data)
  return response.data
}
export const acceptAuthenticationRegister = async (data) => {
  const response = await httpClient.post('/authen/acceptAuthenticationRegister', data)
  return response.data
}

// ─── Profile API ─────────────────────────────────────────────────────────────

/**
 * Lấy thông tin profile theo username (dùng cho trang tài khoản của chính mình)
 * Endpoint: GET /api-accounts/profile?username=xxx (không cần ROLE_ADMIN)
 */
export const getProfileByUsername = async (username) => {
  const response = await httpClient.get(`/api-accounts/profile?username=${username}`)
  return unwrapApiResult(response, null)
}

/**
 * Cập nhật thông tin profile
 * Endpoint: PUT /api-accounts/profile
 */
export const updateProfile = async (profileData) => {
  const response = await httpClient.put('/api-accounts/profile', profileData)
  return unwrapApiResult(response, null)
}

// ─── Login History API ────────────────────────────────────────────────────────

/**
 * Lấy lịch sử đăng nhập thiết bị của người dùng đang đăng nhập
 * Endpoint: GET /login-history/me
 */
export const getLoginHistory = async () => {
  const response = await httpClient.get('/login-history/me')
  return unwrapApiResult(response, [])
}

/**
 * Xóa một bản ghi lịch sử đăng nhập (xóa phiên thiết bị)
 * Endpoint: DELETE /login-history/{historyId}
 */
export const deleteLoginHistoryById = async (historyId) => {
  const response = await httpClient.delete(`/login-history/${historyId}`)
  return response.data
}
