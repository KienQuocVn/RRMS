import axios from 'axios'
import { env } from '~/configs/environment'

const httpClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    'ngrok-skip-browser-warning': '69420'
  }
})

httpClient.interceptors.request.use(
  (config) => {
    const storedUser = sessionStorage.getItem('user')
    const user = storedUser ? JSON.parse(storedUser) : null

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem('user')

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?reason=session-expired'
      }
    }

    return Promise.reject(error)
  }
)

export default httpClient
