import axios from 'axios'
import { env } from '~/configs/environment'

const publicHttpClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: {
    'ngrok-skip-browser-warning': '69420'
  }
})

export default publicHttpClient
