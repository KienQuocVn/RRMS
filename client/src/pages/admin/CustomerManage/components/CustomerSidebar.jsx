import { Link, useLocation } from 'react-router-dom'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

const MENU_ITEMS = [
  { label: 'Tổng quan', to: '/customerManage', icon: DashboardOutlinedIcon, exact: true },
  { label: 'Thông tin phòng', to: '/customerManage/thong-tin-phong', icon: MeetingRoomOutlinedIcon },
  { label: 'Hợp đồng thuê', to: '/customerManage/hop-dong-thue', icon: DescriptionOutlinedIcon },
  { label: 'Hóa đơn hàng tháng', to: '/customerManage/hoa-don', icon: ReceiptLongOutlinedIcon },
  { label: 'Yêu cầu bảo trì', to: '/customerManage/bao-tri', icon: BuildOutlinedIcon },
  { label: 'Bài đăng của tôi', to: '/customerManage/bai-dang', icon: ArticleOutlinedIcon },
  { label: 'Thông báo', to: '/customerManage/thong-bao', icon: NotificationsNoneOutlinedIcon },
  { label: 'Hồ sơ của tôi', to: '/customerManage/ho-so', icon: AccountCircleOutlinedIcon },
  { label: 'Đổi mật khẩu', to: '/customerManage/doi-mat-khau', icon: LockOutlinedIcon },
]

const BOTTOM_ITEMS = [
  { label: 'Đăng xuất', to: null, icon: LogoutOutlinedIcon, isLogout: true }
]

const isActivePath = (pathname, to, exact = false) => {
  if (exact) return pathname === to || pathname === `${to}/`
  return pathname.startsWith(to)
}

const CustomerSidebar = ({ onLogout }) => {
  const { pathname } = useLocation()

  return (
    <Box sx={{ px: 1.5, py: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Box component="img" src="/bg2.png" sx={{ width: 110, height: 54, objectFit: 'contain' }} />
      </Link>

      {/* Role badge */}
      <Box sx={{ px: 1, mb: 1.5 }}>
        <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Nhà Trọ
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
          Tenant
        </Typography>
      </Box>

      {/* Nav items */}
      <List component="nav" disablePadding sx={{ flex: 1 }}>
        {MENU_ITEMS.map((item) => {
          const active = item.to ? isActivePath(pathname, item.to, item.exact) : false
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.label}
              component={item.to ? Link : 'div'}
              to={item.to || undefined}
              sx={{
                borderRadius: '8px',
                mb: 0.25,
                py: 0.85,
                px: 1.25,
                borderLeft: active ? '2px solid #20a9e7' : '2px solid transparent',
                color: active ? '#20a9e7' : 'rgba(255,255,255,0.65)',
                bgcolor: active ? 'rgba(32,169,231,0.09)' : 'transparent',
                '&:hover': {
                  bgcolor: active ? 'rgba(32,169,231,0.14)' : 'rgba(255,255,255,0.05)',
                  color: active ? '#20a9e7' : '#ffffff'
                }
              }}>
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <Icon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 400,
                  lineHeight: 1.3
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* Bottom logout */}
      <List disablePadding>
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.label}
              onClick={item.isLogout ? onLogout : undefined}
              sx={{
                borderRadius: '8px',
                py: 0.85,
                px: 1.25,
                color: 'rgba(255,255,255,0.5)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#ff6b6b' }
              }}>
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <Icon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 12.5 }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default CustomerSidebar
