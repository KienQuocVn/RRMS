import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AdminManage.css'
import ListUsers from './Dashboard/ListUsers'
import ListPosts from './Dashboard/ListPosts'
import DashboardHome from './Dashboard/DashboardHome'
import AdminSidebar from './components/AdminSidebar'
import ChangePasswordModal from './components/ChangePasswordModal'
import { getStoredAuthUser, logout as logoutRequest } from '~/apis/accountAPI'
import { changePassword } from '~/apis/profileAPI'
import { useAuth } from '~/hooks/useAuth'
import {
  Box,
  Typography,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications,
  ExpandMore
} from '@mui/icons-material'
import ListSupports from './Dashboard/ListSupports'

const PAGE_TITLES = {
  '/adminManage': 'Tổng quan',
  '/adminManage/manage-users/list': 'Người dùng',
  '/adminManage/manage-users/add': 'Thêm người dùng',
  '/adminManage/manage-posts/list': 'Duyệt bài đăng',
  '/adminManage/manage-posts/add': 'Thêm đăng tin',
  '/adminManage/manage-supports/list': 'Báo cáo vi phạm'
}

const AdminManage = ({ setIsAdmin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUsername, setAvatar, setToken } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [user] = useState(() => JSON.parse(sessionStorage.getItem('user') || 'null'))
  const pageTitle = PAGE_TITLES[location.pathname] || 'Tổng quan'

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const resetClientSession = useCallback(() => {
    sessionStorage.removeItem('user')
    setToken(null)
    setUsername('')
    setAvatar('')
    setIsAdmin(false)
  }, [setAvatar, setIsAdmin, setToken, setUsername])

  const handleOpenChangePassword = () => {
    handleMenuClose()
    setChangePasswordOpen(true)
  }

  const handleCloseChangePassword = () => {
    if (changePasswordLoading) return
    setChangePasswordOpen(false)
  }

  const handleChangePasswordSubmit = async ({ oldPassword, newPassword }) => {
    const username = user?.username || getStoredAuthUser()?.username

    if (!username) {
      throw { response: { data: { message: 'Không tìm thấy thông tin tài khoản, vui lòng đăng nhập lại.' } } }
    }

    setChangePasswordLoading(true)

    try {
      await changePassword({ username, oldPassword, newPassword })
      setChangePasswordOpen(false)
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Thay đổi mật khẩu thành công!'
      })
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const handleLogout = async () => {
    handleMenuClose()

    const token = getStoredAuthUser()?.token ?? user?.token ?? null

    if (!token) {
      resetClientSession()
      navigate('/login')
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Không tìm thấy token, vui lòng đăng nhập lại.'
      })
      return
    }

    try {
      const response = await logoutRequest(token)
      resetClientSession()
      navigate('/login')
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: response?.message || 'Đăng xuất thành công!'
      })
    } catch (error) {
      if (error?.response?.status === 401) {
        resetClientSession()
        navigate('/login')
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đăng xuất thành công!'
        })
        return
      }

      Swal.fire({
        icon: 'error',
        title: 'Đăng xuất thất bại',
        text: error?.response?.data?.message || 'Đã xảy ra lỗi khi thực hiện đăng xuất.'
      })
    }
  }

  const isMenuOpen = Boolean(anchorEl)

  useEffect(() => {
    setIsAdmin(true)
  }, [setIsAdmin])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="wrapper">
      <aside id="sidebar" className={isCollapsed ? 'collapsed' : ''}>
        <AdminSidebar />
      </aside>
      <div className="main admin-manage-main">
        <nav className="admin-top-header navbar navbar-expand px-3 d-flex justify-content-between align-items-center">
          {/* Sidebar Toggle Button */}
          <button className="btn" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#111827', minWidth: 120 }}>
            {pageTitle}
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              maxWidth: 420,
              mx: 2,
              px: 1.5,
              py: 0.75,
              bgcolor: '#f5f7fa',
              borderRadius: '8px',
              border: '0.5px solid #e5e7eb'
            }}>
            <SearchIcon sx={{ mr: 1, color: '#9ca3af', fontSize: 20 }} />
            <InputBase placeholder="Tìm kiếm..." fullWidth sx={{ fontSize: 13 }} />
          </Box>

          {/* Right Actions */}
          <div className="d-flex align-items-center ms-auto">
            {/* Notification Icon */}
            <Badge style={{ marginRight: '20px' }} badgeContent={4} color="primary">
              <Notifications color="action" />
            </Badge>

            {/* Profile Avatar with Dropdown Menu */}
            <Box
              className="mx-2 d-flex align-items-center"
              onClick={handleProfileMenuOpen}
              aria-label="open profile"
              sx={{ cursor: 'pointer' }}>
              <Avatar
                src={user.avatar}
                alt="profile user"
                sx={{
                  width: 36,
                  height: 36,
                  border: '2px solid #3f51b5',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {user.username}
              </Typography>
              <ExpandMore />
            </Box>
          </div>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenChangePassword}>
              <i className="bi bi-lock" style={{ marginRight: '8px' }}></i> Đổi Mật Khẩu
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" style={{ marginRight: '8px' }}></i> Đăng xuất
            </MenuItem>
          </Menu>

          <ChangePasswordModal
            open={changePasswordOpen}
            loading={changePasswordLoading}
            onClose={handleCloseChangePassword}
            onSubmit={handleChangePasswordSubmit}
          />
        </nav>

        <main className="content admin-manage-content">
          <div className="container-fluid admin-manage-container">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="manage-users/list" element={<ListUsers />} />
              <Route path="manage-posts/list" element={<ListPosts />} />
              <Route path="manage-supports/list" element={<ListSupports />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminManage
