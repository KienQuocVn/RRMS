const DAY_IN_MS = 24 * 60 * 60 * 1000

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const toDateValue = (value) => {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

const sortByNewest = (rooms) => [...rooms].sort((left, right) => toDateValue(right?.moveInDate) - toDateValue(left?.moveInDate))

const dedupeRooms = (rooms) => {
  const seen = new Set()

  return rooms.filter((room) => {
    const key = room?.bulletinBoardId

    if (!key || seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export const getAddressParts = (address = '') => {
  const parts = address
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    detail: parts[0] || '',
    ward: parts.length >= 3 ? parts[parts.length - 3] : '',
    district: parts.length >= 2 ? parts[parts.length - 2] : '',
    province: parts.length >= 1 ? parts[parts.length - 1] : ''
  }
}

export const hasPromotionalPrice = (room) => {
  const basePrice = toNumber(room?.rentPrice)
  const promotionPrice = toNumber(room?.promotionalRentalPrice)
  return promotionPrice > 0 && promotionPrice < basePrice
}

export const getEffectivePrice = (room) => {
  if (hasPromotionalPrice(room)) {
    return toNumber(room?.promotionalRentalPrice)
  }

  return toNumber(room?.rentPrice)
}

export const getPromotionPercent = (room) => {
  const basePrice = toNumber(room?.rentPrice)
  const promotionPrice = toNumber(room?.promotionalRentalPrice)

  if (basePrice <= 0 || promotionPrice <= 0 || promotionPrice >= basePrice) {
    return 0
  }

  return Math.round(((basePrice - promotionPrice) / basePrice) * 100)
}

export const isReadyToMoveIn = (room) => {
  if (!room?.moveInDate) return true

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return toDateValue(room.moveInDate) <= today.getTime() + DAY_IN_MS - 1
}

export const getMoveInLabel = (room) => {
  if (!room?.moveInDate || isReadyToMoveIn(room)) {
    return 'Có thể vào ở ngay'
  }

  return `Vào ở từ ${new Date(room.moveInDate).toLocaleDateString('vi-VN')}`
}

const getRoomScore = (room) => {
  const reviewCount = room?.bulletinBoardReviews?.length || 0
  const amenityCount = room?.bulletinBoardRentalAmenities?.length || 0
  const imageCount = room?.bulletinBoardImages?.length || 0
  const descriptionScore = room?.description ? Math.min(room.description.length / 80, 2) : 0
  const freshnessScore = toDateValue(room?.moveInDate) ? 1 : 0

  return (
    (hasPromotionalPrice(room) ? 4 : 0) +
    (isReadyToMoveIn(room) ? 3 : 0) +
    Math.min(reviewCount, 4) +
    Math.min(amenityCount, 4) +
    Math.min(imageCount, 3) +
    descriptionScore +
    freshnessScore
  )
}

const buildLocationGroups = (rooms, level) => {
  const buckets = new Map()

  rooms.forEach((room) => {
    const label = getAddressParts(room?.address)[level]

    if (!label) return

    const current = buckets.get(label) || {
      label,
      count: 0,
      totalPrice: 0,
      sampleRoom: room
    }

    current.count += 1
    current.totalPrice += getEffectivePrice(room)

    if ((room?.bulletinBoardImages?.length || 0) > (current.sampleRoom?.bulletinBoardImages?.length || 0)) {
      current.sampleRoom = room
    }

    buckets.set(label, current)
  })

  return [...buckets.values()]
    .map((entry) => ({
      ...entry,
      averagePrice: entry.count > 0 ? Math.round(entry.totalPrice / entry.count) : 0
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count
      }

      return left.averagePrice - right.averagePrice
    })
}

const buildPopularRooms = (rooms, limit) =>
  [...rooms]
    .sort((left, right) => {
      const scoreDiff = getRoomScore(right) - getRoomScore(left)

      if (scoreDiff !== 0) {
        return scoreDiff
      }

      return toDateValue(right?.moveInDate) - toDateValue(left?.moveInDate)
    })
    .slice(0, limit)

const buildReadyRooms = (rooms, limit) => {
  const readyRooms = rooms.filter(isReadyToMoveIn)

  if (readyRooms.length === 0) {
    return sortByNewest(rooms).slice(0, limit)
  }

  return readyRooms
    .sort((left, right) => {
      const priceDiff = getEffectivePrice(left) - getEffectivePrice(right)

      if (priceDiff !== 0) {
        return priceDiff
      }

      return getRoomScore(right) - getRoomScore(left)
    })
    .slice(0, limit)
}

const buildSuggestionMeta = (room) => {
  if (hasPromotionalPrice(room)) {
    return {
      badge: `Ưu đãi ${getPromotionPercent(room)}%`,
      description: 'Mức giá đang tốt hơn giá niêm yết, phù hợp để chốt nhanh.'
    }
  }

  const reviewCount = room?.bulletinBoardReviews?.length || 0

  if (reviewCount > 0) {
    return {
      badge: `${reviewCount} đánh giá`,
      description: 'Tin đăng đã có phản hồi thực tế từ người thuê hoặc người xem trước đó.'
    }
  }

  if (isReadyToMoveIn(room)) {
    return {
      badge: 'Dọn vào ngay',
      description: 'Phòng đã sẵn sàng, phù hợp người cần chuyển vào sớm.'
    }
  }

  return {
    badge: 'Thông tin đầy đủ',
    description: 'Tin có ảnh, mô tả và mức giá rõ ràng để bạn so sánh nhanh.'
  }
}

const buildSpecialSuggestions = (rooms, limit) => {
  const promotionRoom = [...rooms]
    .filter(hasPromotionalPrice)
    .sort((left, right) => getPromotionPercent(right) - getPromotionPercent(left))[0]

  const reviewRoom = [...rooms].sort(
    (left, right) => (right?.bulletinBoardReviews?.length || 0) - (left?.bulletinBoardReviews?.length || 0)
  )[0]

  const readyRoom = buildReadyRooms(rooms, 1)[0]
  const popularRoom = buildPopularRooms(rooms, 1)[0]
  const newestRoom = sortByNewest(rooms)[0]

  return dedupeRooms([promotionRoom, reviewRoom, readyRoom, popularRoom, newestRoom])
    .slice(0, limit)
    .map((room) => ({
      room,
      ...buildSuggestionMeta(room)
    }))
}

export const buildRrmsDashboard = ({ allRooms = [], latestRooms = [] }) => {
  const normalizedRooms = dedupeRooms(allRooms.filter(Boolean))
  const normalizedLatestRooms =
    latestRooms.length > 0 ? dedupeRooms(latestRooms.filter(Boolean)) : sortByNewest(normalizedRooms)

  const provinceGroups = buildLocationGroups(normalizedRooms, 'province')
  const districtGroups = buildLocationGroups(normalizedRooms, 'district')
  const wardGroups = buildLocationGroups(normalizedRooms, 'ward')
  const popularRooms = buildPopularRooms(normalizedRooms, 8)
  const readyRooms = buildReadyRooms(normalizedRooms, 8)
  const specialSuggestions = buildSpecialSuggestions(normalizedRooms, 4)
  const promotionRooms = [...normalizedRooms]
    .filter(hasPromotionalPrice)
    .sort((left, right) => getPromotionPercent(right) - getPromotionPercent(left))
  const promotionHeroRoom = promotionRooms[0] || popularRooms[0] || normalizedLatestRooms[0] || null

  return {
    allRooms: normalizedRooms,
    latestRooms: normalizedLatestRooms,
    popularRooms,
    readyRooms,
    specialSuggestions,
    promotionHeroRoom,
    provinceGroups,
    districtGroups,
    wardGroups,
    stats: {
      totalRooms: normalizedRooms.length,
      latestRooms: normalizedLatestRooms.length,
      readyRooms: normalizedRooms.filter(isReadyToMoveIn).length,
      promotionRooms: promotionRooms.length,
      provinces: provinceGroups.length,
      districts: districtGroups.length,
      wards: wardGroups.length,
      averagePrice:
        normalizedRooms.length > 0
          ? Math.round(normalizedRooms.reduce((total, room) => total + getEffectivePrice(room), 0) / normalizedRooms.length)
          : 0
    }
  }
}
