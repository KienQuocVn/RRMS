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
