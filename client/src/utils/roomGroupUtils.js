export const LEGACY_GROUP_LABELS = { a: 'Tầng trệt', b: 'Lầu 1' }

export const DEFAULT_GROUP_SUGGESTIONS = ['Tầng trệt', 'Tầng 1', 'Tầng 2', 'Tầng 3']

export const normalizeRoomGroup = (group) => {
  if (!group) return ''
  const trimmed = String(group).trim()
  return LEGACY_GROUP_LABELS[trimmed] || trimmed
}

export const formatRoomGroupLabel = (group) => {
  if (!group) return ''
  return normalizeRoomGroup(group)
}

const getFloorSortOrder = (group) => {
  const normalized = normalizeRoomGroup(group)
  const lower = normalized.toLowerCase()

  if (lower.includes('trệt')) return 0

  const match = lower.match(/(?:tầng|lầu)\s*(\d+)/)
  if (match) return parseInt(match[1], 10)

  return 1000
}

export const sortRoomGroups = (groups) => {
  const unique = [...new Set(groups.map(normalizeRoomGroup).filter(Boolean))]

  return unique.sort((a, b) => {
    const orderA = getFloorSortOrder(a)
    const orderB = getFloorSortOrder(b)
    if (orderA !== orderB) return orderA - orderB
    return a.localeCompare(b, 'vi')
  })
}

export const buildRoomGroupOptions = (roomGroups = [], suggestions = DEFAULT_GROUP_SUGGESTIONS) => {
  return sortRoomGroups([...roomGroups, ...suggestions])
}

export const getDefaultGroupFromList = (roomGroups = []) => {
  const names = roomGroups.map((group) => (typeof group === 'string' ? group : group?.name)).filter(Boolean)
  const options = buildRoomGroupOptions(names)
  return options[0] || DEFAULT_GROUP_SUGGESTIONS[0]
}

export const sortRoomGroupItems = (roomGroups = []) => {
  const sortedNames = sortRoomGroups(
    roomGroups.map((group) => (typeof group === 'string' ? group : group?.name)).filter(Boolean)
  )

  return sortedNames
    .map((name) =>
      roomGroups.find((group) => normalizeRoomGroup(typeof group === 'string' ? group : group?.name) === name)
    )
    .filter(Boolean)
}
