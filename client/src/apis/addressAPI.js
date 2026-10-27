import axios from 'axios'
import { env } from '~/configs/environment'

const ADDRESS_PROXY_BASE = `${env.API_URL}/public/address`
const getAddressData = (api, level, id) => axios.get(`${ADDRESS_PROXY_BASE}/${api}/${level}/${id}.htm`)

/** API 34 tỉnh thành mới: Tỉnh/Thành -> Phường/Xã */
export const getTinhThanh = async () => {
  return getAddressData('new', 1, 0)
}

export const getPhuongXaByTinh = async (provinceId) => {
  return getAddressData('new', 2, provinceId)
}

export const getFullAddressData = async () => {
  return getAddressData('new', 4, 0)
}

export const getLocationById = async (id) => {
  return getAddressData('new', 5, id)
}

/** API cũ 3 cấp (Tỉnh -> Quận/Huyện -> Phường/Xã) — dùng cho màn hình chưa migrate */
export const getQuanHuyen = async (provinceId) => {
  return getAddressData('old', 2, provinceId)
}

export const getPhuongXa = async (districtId) => {
  return getAddressData('old', 3, districtId)
}
