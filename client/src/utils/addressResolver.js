import { useState, useEffect } from 'react'
import { getLocationById } from '~/apis/addressAPI'

// Cache to store resolved location names to avoid duplicate API calls
const locationCache = new Map()

/**
 * Resolves a single administrative ID (e.g. '22363') to its name.
 */
export async function resolveLocationId(id) {
  if (!id || !/^\d+$/.test(id)) return id
  if (locationCache.has(id)) return locationCache.get(id)

  try {
    const res = await getLocationById(id)
    if (res.data?.error === 0 && res.data?.data) {
      const name = res.data.data.full_name || res.data.data.name
      if (name) {
        locationCache.set(id, name)
        return name
      }
    }
  } catch (error) {
    console.error(`Lỗi khi giải mã địa chỉ ID ${id}:`, error)
  }
  return id
}

/**
 * Parses an address string and resolves any numeric parts (IDs).
 */
export async function resolveAddress(addressStr) {
  if (!addressStr) return ''
  const parts = addressStr.split(',').map((p) => p.trim()).filter(Boolean)

  const resolvedParts = await Promise.all(
    parts.map(async (part) => {
      if (/^\d+$/.test(part)) {
        return await resolveLocationId(part)
      }
      return part
    })
  )

  return resolvedParts.join(', ')
}

/**
 * A custom React hook to resolve ID-based address strings to readable address strings.
 */
export function useAddressResolver(addressStr) {
  const [resolvedAddress, setResolvedAddress] = useState(addressStr || '')

  useEffect(() => {
    let isMounted = true
    if (!addressStr) {
      setResolvedAddress('')
      return
    }

    const parts = addressStr.split(',').map((p) => p.trim())
    const hasIds = parts.some((p) => /^\d+$/.test(p))
    if (!hasIds) {
      setResolvedAddress(addressStr)
      return
    }

    resolveAddress(addressStr).then((res) => {
      if (isMounted) {
        setResolvedAddress(res)
      }
    })

    return () => {
      isMounted = false
    }
  }, [addressStr])

  return resolvedAddress
}
