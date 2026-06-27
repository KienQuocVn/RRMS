import { getLocationById, getTinhThanh } from '~/apis/addressAPI'

let provinceCache = null

export async function loadProvinces() {
  if (provinceCache) return provinceCache

  try {
    const res = await getTinhThanh()
    if (res.data?.error === 0) {
      provinceCache = res.data.data
    }
  } catch (error) {
    console.error('Không thể tải danh sách tỉnh thành:', error)
  }

  return provinceCache
}

export async function findProvinceFromAddress(address) {
  if (!address) return null

  await loadProvinces()

  const parts = address
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (parts.length === 0) return null

  const lastPart = parts[parts.length - 1]

  if (/^\d+$/.test(lastPart)) {
    const fromCache = provinceCache?.find((p) => String(p.id) === lastPart)
    if (fromCache) return fromCache.name

    try {
      const res = await getLocationById(lastPart)
      if (res.data?.error === 0 && res.data?.data) {
        return res.data.data.name || res.data.data.full_name
      }
    } catch (error) {
      console.error('Không thể tra cứu tỉnh thành:', error)
    }
  }

  return findProvinceRegex(address)
}

export function findProvinceRegex(address) {
  if (!address) return null

  const parts = address
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (parts.length === 0) return null

  const lastPart = parts[parts.length - 1]

  if (provinceCache && /^\d+$/.test(lastPart)) {
    const found = provinceCache.find((p) => String(p.id) === lastPart)
    if (found) return found.name
  }

  if (provinceCache?.length) {
    const names = provinceCache.map((p) => p.name)
    const regex = new RegExp(
      names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
      'i'
    )
    const match = address.match(regex)
    if (match) return match[0]
  }

  return lastPart
}
