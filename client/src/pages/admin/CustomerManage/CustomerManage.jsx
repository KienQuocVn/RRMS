import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './CustomerManage.css'
import CustomerSidebar from './components/CustomerSidebar'
import CustomerDashboard from './Dashboard/CustomerDashboard'
import MonthlyBills from './Bills/MonthlyBills'
import RoomDetail from './Room/RoomDetail'
import RentalContract from './Contract/RentalContract'
import { getStoredAuthUser, logout as logoutRequest } from '~/apis/accountAPI'
import { useAuth } from '~/hooks/useAuth'
import { Box, Typography, InputBase, Avatar, Badge, Link as MuiLink } from '@mui/material'
import { Search as SearchIcon, Notifications } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const PAGE_TITLES = {
  '/customerManage': 'Tổng quan',
  '/customerManage/thong-tin-phong': 'Thông tin phòng',
  '/customerManage/hop-dong-thue': 'Hợp đồng thuê',
  '/customerManage/hoa-don': 'Hóa đơn hàng tháng',
  '/customerManage/bao-tri': 'Yêu cầu bảo trì',
  '/customerManage/bai-dang': 'Bài đăng của tôi',
  '/customerManage/thong-bao': 'Thông báo',
  '/customerManage/ho-so': 'Hồ sơ của tôi',
  '/customerManage/doi-mat-khau': 'Đổi mật khẩu'
}

const CustomerManage = ({ setIsAdmin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUsername, setAvatar, setToken } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user] = useState(() => JSON.parse(sessionStorage.getItem('user') || 'null'))

  const pageTitle = PAGE_TITLES[location.pathname] || 'Tổng quan'

  const resetClientSession = useCallback(() => {
    sessionStorage.removeItem('user')
    setToken(null)
    setUsername('')
    setAvatar('')
    setIsAdmin(false)
  }, [setAvatar, setIsAdmin, setToken, setUsername])

  const handleLogout = async () => {
    const token = getStoredAuthUser()?.token ?? user?.token ?? null

    if (!token) {
      resetClientSession()
      navigate('/login')
      Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Không tìm thấy token, vui lòng đăng nhập lại.' })
      return
    }

    try {
      const response = await logoutRequest(token)
      resetClientSession()
      navigate('/login')
      Swal.fire({ icon: 'success', title: 'Thành công', text: response?.message || 'Đăng xuất thành công!' })
    } catch (error) {
      if (error?.response?.status === 401) {
        resetClientSession()
        navigate('/login')
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đăng xuất thành công!' })
        return
      }
      Swal.fire({
        icon: 'error',
        title: 'Đăng xuất thất bại',
        text: error?.response?.data?.message || 'Đã xảy ra lỗi khi thực hiện đăng xuất.'
      })
    }
  }

  useEffect(() => {
    setIsAdmin(true)
  }, [setIsAdmin])

  const toggleSidebar = () => setIsCollapsed((prev) => !prev)

  const displayName = user?.displayName || user?.username || 'NV'
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()

  return (
    <div className="customer-wrapper">
      {/* Sidebar */}
      <aside id="customer-sidebar" className={isCollapsed ? 'collapsed' : ''}>
        <CustomerSidebar onLogout={handleLogout} />
      </aside>

      {/* Main area */}
      <div className="customer-main">
        {/* Top header */}
        <nav className="customer-top-header">
          {/* Toggle */}
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              marginRight: 8,
              borderRadius: 6,
              color: '#6b7280'
            }}
            aria-label="Toggle sidebar">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
            <MuiLink
              component={Link}
              to="/customerManage"
              underline="none"
              sx={{ fontSize: 13, color: '#20a9e7', fontWeight: 500 }}>
              Thông tin người thuê nhà
            </MuiLink>
            {location.pathname !== '/customerManage' && (
              <>
                <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>/</Typography>
                <Typography sx={{ fontSize: 13, color: '#374151' }}>{pageTitle}</Typography>
              </>
            )}
          </Box>

          {/* Search */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              maxWidth: 380,
              px: 1.5,
              py: 0.65,
              bgcolor: '#f5f7fa',
              borderRadius: '8px',
              border: '0.5px solid #e5e7eb'
            }}>
            <SearchIcon sx={{ mr: 1, color: '#9ca3af', fontSize: 18 }} />
            <InputBase placeholder="Tìm kiếm..." fullWidth sx={{ fontSize: 13 }} />
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {/* Bell */}
            <Badge badgeContent={2} color="primary" sx={{ cursor: 'pointer' }}>
              <Notifications sx={{ color: '#6b7280', fontSize: 22 }} />
            </Badge>

            {/* Avatar + name */}
            <Box
              component={Link}
              to="/customerManage/ho-so"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                textDecoration: 'none',
                '&:hover': { opacity: 0.8 }
              }}>
              <Avatar
                src={user?.avatar}
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: '#20a9e7',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                {!user?.avatar && initials}
              </Avatar>
              <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Profile</Typography>
            </Box>
          </Box>
        </nav>

        {/* Content */}
        <main className="customer-content">
          <div className="customer-container" style={{ padding: 0 }}>
            <Routes>
              <Route index element={<CustomerDashboard />} />
              {/* Placeholder routes — có thể thêm component sau */}
              <Route path="thong-tin-phong" element={<RoomDetail />} />
              <Route path="hop-dong-thue" element={<RentalContract />} />
              <Route path="hoa-don" element={<MonthlyBills />} />
              <Route path="bao-tri" element={<CustomerDashboard />} />
              <Route path="bai-dang" element={<CustomerDashboard />} />
              <Route path="dang-tin" element={<CustomerDashboard />} />
              <Route path="thong-bao" element={<CustomerDashboard />} />
              <Route path="ho-so" element={<CustomerDashboard />} />
              <Route path="doi-mat-khau" element={<CustomerDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CustomerManage
