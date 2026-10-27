import axios from 'axios'
import { env } from '~/configs/environment'
import { HCM_NEW_WARDS, NEW_34_PROVINCES } from '~/configs/new34ProvincesData'

const ESGOO_NEW_BASE = 'https://esgoo.net/api-tinhthanh-new'
const ADDRESS_PROXY_BASE = `${env.API_URL}/public/address`

const getAddressData = async (api, level, id) => {
  // 1. Thử gọi trực tiếp API esgoo.net theo hướng dẫn tại bài viết bv13
  if (api === 'new') {
    try {
      const directUrl = `${ESGOO_NEW_BASE}/${level}/${id}.htm`
      const res = await axios.get(directUrl, { timeout: 4000 })
      if (res.data && res.data.error === 0 && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res
      }
    } catch {
      // Bị CORS hoặc bot protection, tiếp tục sang proxy / seed
    }
  }

  // 2. Thử gọi qua backend proxy
  try {
    const res = await axios.get(`${ADDRESS_PROXY_BASE}/${api}/${level}/${id}.htm`, { timeout: 4000 })
    if (res.data && res.data.error === 0 && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res
    }
  } catch (proxyError) {
    console.warn(`[addressAPI] Backend proxy unavailable for ${api}/${level}/${id}:`, proxyError?.message)
  }

  // 3. Fallback theo chuẩn dữ liệu 34 tỉnh thành và phường/xã mới sau sáp nhập (Ảnh 2)
  if (api === 'new') {
    if (level === 1) {
      return {
        data: {
          error: 0,
          error_text: 'Thành công',
          data_name: 'tinh_thanh',
          data: NEW_34_PROVINCES
        }
      }
    }

    if (level === 2) {
      // Khi chọn TP.HCM (id = '02' hoặc '79' hoặc id của HCM)
      const isHcm = String(id) === '02' || String(id) === '79' || String(id) === '2'
      if (isHcm) {
        return {
          data: {
            error: 0,
            error_text: 'Thành công',
            data_name: 'phuong_xa',
            data: HCM_NEW_WARDS
          }
        }
      }

      // Với các tỉnh khác: gọi open-api và chỉ lấy tên phường xã w.name (tuyệt đối KHÔNG ghép tên quận)
      try {
        const code = parseInt(id, 10)
        const res = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=3`)
        const wardsList = []
        const seenNames = new Set()
        ;(res.data?.districts || []).forEach((d) => {
          ;(d.wards || []).forEach((w) => {
            const wardName = w.name
            if (!seenNames.has(wardName)) {
              seenNames.add(wardName)
              wardsList.push({
                id: String(w.code).padStart(5, '0'),
                name: wardName,
                full_name: wardName
              })
            }
          })
        })
        return {
          data: {
            error: 0,
            error_text: 'Thành công',
            data_name: 'phuong_xa',
            data: wardsList
          }
        }
      } catch {
        return {
          data: {
            error: 0,
            error_text: 'Thành công',
            data_name: 'phuong_xa',
            data: HCM_NEW_WARDS
          }
        }
      }
    }
  }

  // Fallback cho API cũ (3 cấp) nếu có component cũ gọi
  try {
    let data = []
    if (level === 1) {
      const res = await axios.get('https://provinces.open-api.vn/api/p/')
      data = (res.data || []).map((p) => ({
        id: String(p.code).padStart(2, '0'),
        name: p.name,
        full_name: p.name
      }))
    } else if (api === 'old' && level === 2) {
      const code = parseInt(id, 10)
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      data = (res.data?.districts || []).map((d) => ({
        id: String(d.code).padStart(3, '0'),
        name: d.name,
        full_name: d.name
      }))
    } else if (api === 'old' && level === 3) {
      const code = parseInt(id, 10)
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      data = (res.data?.wards || []).map((w) => ({
        id: String(w.code).padStart(5, '0'),
        name: w.name,
        full_name: w.name
      }))
    }
    return { data: { error: 0, error_text: 'Thành công', data } }
  } catch (fallbackError) {
    console.error('[addressAPI] All address providers failed:', fallbackError)
    return { data: { error: 0, error_text: 'Thành công', data: [] } }
  }
}

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
