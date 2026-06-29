import { Link, useLocation } from 'react-router-dom'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'

const MENU_ITEMS = [
  { label: 'Tổng quan', to: '/adminManage', icon: DashboardOutlinedIcon, exact: true },
  { label: 'Duyệt bài đăng', to: '/adminManage/manage-posts/list', icon: FactCheckOutlinedIcon },
  { label: 'Báo cáo vi phạm', to: '/adminManage/manage-supports/list', icon: ReportOutlinedIcon },
  { label: 'Người dùng', to: '/adminManage/manage-users/list', icon: PeopleOutlineIcon },
  // Các mục dưới đây chưa có route riêng -> disable để không bị active sai
  { label: 'Nhà trọ', to: null, icon: BusinessOutlinedIcon, disabled: true },
  { label: 'Phòng trọ', to: null, icon: MeetingRoomOutlinedIcon, disabled: true },
  { label: 'Giao dịch', to: null, icon: PaymentsOutlinedIcon, disabled: true },
  { label: 'Cài đặt', to: null, icon: SettingsOutlinedIcon, disabled: true },
  { label: 'Nhật ký hoạt động', to: null, icon: HistoryOutlinedIcon, disabled: true }
]

const isActivePath = (pathname, to, exact = false) => {
  if (exact) return pathname === to || pathname === `${to}/`
  return pathname.startsWith(to)
}

const AdminSidebar = () => {
  const { pathname } = useLocation()

  return (
    <Box sx={{ px: 1.5, py: 2, height: '100%' }}>
      <Box sx={{ px: 1, mb: 2.5 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
          Quản Lý
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#20a9e7', lineHeight: 1.3 }}>
          Nhà Trọ
        </Typography>
      </Box>

      <List component="nav" disablePadding>
        {MENU_ITEMS.map((item) => {
          const active = !item.disabled && item.to ? isActivePath(pathname, item.to, item.exact) : false
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.label}
              component={item.to && !item.disabled ? Link : 'div'}
              to={item.to && !item.disabled ? item.to : undefined}
              disabled={Boolean(item.disabled)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 1,
                px: 1.5,
                color: active ? '#ffffff' : 'rgba(255,255,255,0.72)',
                bgcolor: active ? 'rgba(32, 169, 231, 0.18)' : 'transparent',
                opacity: item.disabled ? 0.55 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                '&:hover': {
                  bgcolor: item.disabled
                    ? 'transparent'
                    : active
                      ? 'rgba(32, 169, 231, 0.24)'
                      : 'rgba(255,255,255,0.06)',
                  color: '#ffffff'
                }
              }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default AdminSidebar
