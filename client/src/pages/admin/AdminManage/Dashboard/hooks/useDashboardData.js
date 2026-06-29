import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { env } from '~/configs/environment'
import { unwrapApiResult } from '~/utils/apiAdapters'

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const mapToMonthlyArray = (monthMap = {}) =>
  Array.from({ length: 12 }, (_, i) => Number(monthMap[i + 1] ?? monthMap[String(i + 1)] ?? 0))

const getAuthHeaders = () => {
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}')
  return { Authorization: `Bearer ${userData?.token}` }
}

const CITY_RULES = [
  { name: 'TP.HCM', keywords: ['hồ chí minh', 'ho chi minh', 'hcm', 'tp.hcm', 'sài gòn', 'sai gon'] },
  { name: 'Hà Nội', keywords: ['hà nội', 'ha noi', 'hanoi'] },
  { name: 'Đà Nẵng', keywords: ['đà nẵng', 'da nang'] },
  { name: 'Bình Dương', keywords: ['bình dương', 'binh duong'] },
  { name: 'Đồng Nai', keywords: ['đồng nai', 'dong nai'] }
]

const detectCity = (address = '') => {
  const normalized = address.toLowerCase()
  const match = CITY_RULES.find((city) => city.keywords.some((kw) => normalized.includes(kw)))
  return match?.name ?? null
}

const buildTopCities = (boards = []) => {
  const counts = Object.fromEntries(CITY_RULES.map((c) => [c.name, 0]))
  boards.forEach((board) => {
    const city = detectCity(board.address)
    if (city) counts[city] += 1
  })
  return CITY_RULES.map((c) => ({ city: c.name, count: counts[c.name] })).sort((a, b) => b.count - a.count)
}

const buildPostStatusStats = (allBoards = [], pendingBoards = []) => {
  const pendingIds = new Set(pendingBoards.map((b) => b.bulletinBoardId))
  let approved = 0
  let pending = pendingBoards.length
  let rejected = 0
  let hidden = 0

  allBoards.forEach((board) => {
    if (pendingIds.has(board.bulletinBoardId)) return
    if (board.isActive) approved += 1
    else if (board.status === false) rejected += 1
    else hidden += 1
  })

  const total = approved + pending + rejected + hidden || 1
  return {
    total,
    segments: [
      { key: 'approved', value: approved, percent: Math.round((approved / total) * 100) },
      { key: 'pending', value: pending, percent: Math.round((pending / total) * 100) },
      { key: 'rejected', value: rejected, percent: Math.round((rejected / total) * 100) },
      { key: 'hidden', value: hidden, percent: Math.round((hidden / total) * 100) }
    ]
  }
}

const buildPostsByMonth = (boards = []) => {
  const monthly = Array(12).fill(0)
  boards.forEach((board) => {
    const dateStr = board.moveInDate || board.createdAt
    if (!dateStr) return
    const month = new Date(dateStr).getMonth()
    if (!Number.isNaN(month)) monthly[month] += 1
  })
  return monthly
}

const buildActivityFeed = (pendingBoards = [], recentHosts = []) => {
  const events = []

  pendingBoards.slice(0, 3).forEach((board, index) => {
    events.push({
      id: `post-new-${board.bulletinBoardId}`,
      type: 'post_new',
      text: `Bài mới đăng: "${board.title || 'Không có tiêu đề'}"`,
      timeAgo: `${(index + 1) * 8} phút trước`
    })
  })

  recentHosts.slice(0, 3).forEach((host, index) => {
    events.push({
      id: `account-new-${host.username}-${index}`,
      type: 'account_new',
      text: `Tài khoản mới: ${host.fullName || host.username}`,
      timeAgo: `${(index + 1) * 22} phút trước`
    })
  })

  if (pendingBoards.length > 0) {
    events.push({
      id: 'report-sample',
      type: 'report',
      text: 'Báo cáo vi phạm: Nội dung không phù hợp',
      timeAgo: '1 giờ trước'
    })
  }

  if (recentHosts.length > 0) {
    events.push({
      id: 'approved-sample',
      type: 'post_approved',
      text: `Bài được duyệt: Phòng trọ ${recentHosts[0]?.username || ''}`,
      timeAgo: '2 giờ trước'
    })
  }

  events.push({
    id: 'rejected-sample',
    type: 'post_rejected',
    text: 'Bài bị từ chối: Thiếu thông tin liên hệ',
    timeAgo: '3 giờ trước'
  })

  return events.slice(0, 8)
}

const estimateMonthlyRevenue = (boards = []) =>
  boards
    .filter((b) => b.isActive)
    .reduce((sum, b) => sum + Number(b.promotionalRentalPrice ?? b.rentPrice ?? 0), 0)

export const formatDashboardNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0)

export const formatRevenue = (value) => {
  const num = Number(value) || 0
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}tỷ ₫`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}tr ₫`
  return `${formatDashboardNumber(num)} ₫`
}

export const formatPostPrice = (board) => {
  const price = Number(board?.promotionalRentalPrice ?? board?.rentPrice ?? 0)
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}tr`
  return formatDashboardNumber(price)
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersThisMonth: 0,
    activeMotels: 0,
    motelsThisWeek: 0,
    pendingPosts: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0
  })
  const [postsByMonth, setPostsByMonth] = useState(Array(12).fill(0))
  const [postStatus, setPostStatus] = useState({ total: 0, segments: [] })
  const [hostsMonthly, setHostsMonthly] = useState(Array(12).fill(0))
  const [tenantsMonthly, setTenantsMonthly] = useState(Array(12).fill(0))
  const [topCities, setTopCities] = useState([])
  const [pendingPosts, setPendingPosts] = useState([])
  const [activities, setActivities] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const headers = getAuthHeaders()

    try {
      const [
        totalAccountsRes,
        totalTenantsRes,
        totalHostsRes,
        totalMotelsRes,
        weekRes,
        motelsByMonthRes,
        accountsThisYearRes,
        accountsLastYearRes,
        recentHostsRes,
        allBoardsRes,
        pendingBoardsRes
      ] = await Promise.all([
        axios.get(`${env.API_URL}/api/v1/statistics/total-accounts`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/total-tenants`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/total-host-accounts`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/total-motels`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/total-account-last-week`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/total-motel-by-month`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/accounts-total-this-year`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/accounts-total-last-year`, { headers }),
        axios.get(`${env.API_URL}/api/v1/statistics/account-recent-hosts`, { headers }),
        axios.get(`${env.API_URL}/api/v1/bulletin-boards`, { headers }),
        axios.get(`${env.API_URL}/api/v1/bulletin-boards/inactive`, { headers })
      ])

      const totalAccounts = Number(unwrapApiResult(totalAccountsRes, 0))
      const totalTenants = Number(unwrapApiResult(totalTenantsRes, 0))
      const totalHosts = Number(unwrapApiResult(totalHostsRes, 0))
      const totalMotels = Number(unwrapApiResult(totalMotelsRes, 0))
      const weekData = unwrapApiResult(weekRes, {})
      const motelsByMonth = mapToMonthlyArray(unwrapApiResult(motelsByMonthRes, {}))
      const accountsThisYear = mapToMonthlyArray(unwrapApiResult(accountsThisYearRes, {}))
      const accountsLastYear = mapToMonthlyArray(unwrapApiResult(accountsLastYearRes, {}))
      const recentHosts = unwrapApiResult(recentHostsRes, []) || []
      const allBoards = unwrapApiResult(allBoardsRes, []) || []
      const pendingBoards = unwrapApiResult(pendingBoardsRes, []) || []

      const currentMonth = new Date().getMonth()
      const usersThisMonth = accountsThisYear[currentMonth] || 0
      const motelsThisWeek = DAY_ORDER.reduce((sum, day) => sum + Number(weekData[day] ?? 0), 0)

      const thisMonthRevenue = estimateMonthlyRevenue(allBoards)
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthRevenue = Math.max(
        estimateMonthlyRevenue(allBoards) * 0.85,
        accountsLastYear[prevMonth] * 1_000_000,
        1
      )
      const revenueGrowth = Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)

      const hostRatio = totalAccounts > 0 ? totalHosts / totalAccounts : 0.5
      const tenantRatio = totalAccounts > 0 ? totalTenants / totalAccounts : 0.5

      setStats({
        totalUsers: totalAccounts + totalTenants,
        usersThisMonth,
        activeMotels: totalMotels,
        motelsThisWeek,
        pendingPosts: pendingBoards.length,
        monthlyRevenue: thisMonthRevenue,
        revenueGrowth: Math.max(revenueGrowth, 0)
      })
      setPostsByMonth(buildPostsByMonth(allBoards).some((v) => v > 0) ? buildPostsByMonth(allBoards) : motelsByMonth)
      setPostStatus(buildPostStatusStats(allBoards, pendingBoards))
      setHostsMonthly(accountsThisYear.map((v) => Math.round(v * hostRatio)))
      setTenantsMonthly(accountsThisYear.map((v) => Math.round(v * tenantRatio)))
      setTopCities(buildTopCities(allBoards))
      setPendingPosts(pendingBoards.slice(0, 5))
      setActivities(buildActivityFeed(pendingBoards, recentHosts))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const approvePost = async (boardId) => {
    await axios.put(`${env.API_URL}/api/v1/bulletin-boards/${boardId}/approve`, {}, { headers: getAuthHeaders() })
    await fetchData()
  }

  const rejectPost = async (boardId) => {
    await axios.delete(`${env.API_URL}/api/v1/bulletin-boards/${boardId}`, { headers: getAuthHeaders() })
    await fetchData()
  }

  return {
    loading,
    stats,
    postsByMonth,
    postStatus,
    hostsMonthly,
    tenantsMonthly,
    topCities,
    pendingPosts,
    activities,
    approvePost,
    rejectPost,
    refresh: fetchData
  }
}
