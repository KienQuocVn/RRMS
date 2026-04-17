import { Link, useLocation } from 'react-router-dom'
import { Box, Stack } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PieChartIcon from '@mui/icons-material/PieChart'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationBadge from './NotificationBadge'

const navLinkSx = {
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  bgcolor: '#20a9e7',
  borderRadius: '10px',
  mx: '5px',
  my: '10px',
  px: 2,
  py: 1,
  fontSize: 17,
  textDecoration: 'none',
  '&:hover, &.active': {
    bgcolor: '#2b7ed7',
    color: '#fff',
  },
}

const NavLink = ({ to, icon, label, isActive, onClick }) => (
  <Box
    component={Link}
    to={to}
    onClick={onClick}
    sx={{ ...navLinkSx, ...(isActive ? { bgcolor: '#2b7ed7' } : {}) }}
  >
    {icon}
    <Box component="span" sx={{ mt: '5px', fontSize: 14 }}>
      {label}
    </Box>
  </Box>
)

const NavAdminLinks = ({ motel, setIsNavAdmin, handleLogout, tokenExists }) => {
  const location = useLocation()
  const id = motel?.motelId

  const links = [
    { to: id ? `/quanlytro/${id}` : '/quanlytro', icon: <HomeIcon />, label: 'Quản lý trọ' },
    { to: id ? `/bao-cao/${id}` : '#', icon: <PieChartIcon />, label: 'Tổng báo cáo' },
    {
      to: id ? `/dang-tin/${id}` : '#',
      icon: <AddIcon />,
      label: 'Đăng tin',
      onClick: () => setIsNavAdmin(true),
    },
    { to: id ? `/moi-gioi/${id}` : '#', icon: <PeopleIcon />, label: 'Môi giới' },
    { to: id ? `/phan-quyen/${id}` : '#', icon: <BusinessIcon />, label: 'Công ty/nhóm' },
    { to: id ? `/cai-dat/${id}` : '#', icon: <SettingsIcon />, label: 'Cài đặt chung' },
    { to: '/tai-khoan', icon: <PersonIcon />, label: 'Tài khoản' },
  ]

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      {links.map(({ to, icon, label, onClick }) => (
        <NavLink
          key={label}
          to={to}
          icon={icon}
          label={label}
          isActive={location.pathname === to}
          onClick={onClick}
        />
      ))}

      {/* Notification (kept as separate item for dropdown support) */}
      <Box
        component={Link}
        to="#"
        sx={{ ...navLinkSx, position: 'relative' }}
      >
        <NotificationBadge count={0} />
        <Box component="span" sx={{ mt: '5px', fontSize: 14 }}>
          Thông báo
        </Box>
      </Box>

      {/* Logout */}
      {tokenExists && (
        <Box
          component={Link}
          to=""
          onClick={handleLogout}
          sx={navLinkSx}
        >
          <LogoutIcon />
          <Box component="span" sx={{ mt: '5px', fontSize: 14 }}>
            Đăng xuất
          </Box>
        </Box>
      )}
    </Stack>
  )
}

export default NavAdminLinks
