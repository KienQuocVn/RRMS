import publicHttpClient from './publicHttpClient'

export const ValidCaptchaAPI = async (token) => {
  return await publicHttpClient.post('/api/v1/verify-captcha', { token })
}
