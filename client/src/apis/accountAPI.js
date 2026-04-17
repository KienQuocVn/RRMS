import httpClient from './httpClient'

export const getAccountByUsername = async (username) => {
  return await httpClient.get(`/api-accounts/${username}`)
}

export const introspect = async () => {
  const storedUser = sessionStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null
  return await httpClient.post('/authen/introspect', { token: user?.token ?? null })
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
