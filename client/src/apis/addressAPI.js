import axios from 'axios'

const NEW_API_BASE = 'https://esgoo.net/api-tinhthanh-new'
const OLD_API_BASE = 'https://esgoo.net/api-tinhthanh'

/** API 34 tỉnh thành mới: Tỉnh/Thành -> Phường/Xã */
export const getTinhThanh = async () => {
  return axios.get(`${NEW_API_BASE}/1/0.htm`)
}

export const getPhuongXaByTinh = async (provinceId) => {
  return axios.get(`${NEW_API_BASE}/2/${provinceId}.htm`)
}

export const getFullAddressData = async () => {
  return axios.get(`${NEW_API_BASE}/4/0.htm`)
}

export const getLocationById = async (id) => {
  return axios.get(`${NEW_API_BASE}/5/${id}.htm`)
}

/** API cũ 3 cấp (Tỉnh -> Quận/Huyện -> Phường/Xã) — dùng cho màn hình chưa migrate */
export const getQuanHuyen = async (provinceId) => {
  return axios.get(`${OLD_API_BASE}/2/${provinceId}.htm`)
}

export const getPhuongXa = async (districtId) => {
  return axios.get(`${OLD_API_BASE}/3/${districtId}.htm`)
}
