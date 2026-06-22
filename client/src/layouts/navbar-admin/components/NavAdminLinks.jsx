import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Stack, Popover, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Divider } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PieChartIcon from '@mui/icons-material/PieChart'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
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
  cursor: 'pointer',
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

const mockNotifications = [
  {
    id: 1,
    title: "📌 Ktx RRMS vừa thêm giường mới",
    body: "Bánh mì: thêm giường mới",
    time: "2026-05-17T14:40:51.000000Z",
    read: false
  },
  {
    id: 2,
    title: "📌 quoc, Ktx RRMS đã bị xóa",
    body: "Bánh mì: đã xóa giường",
    time: "2026-05-17T14:40:22.000000Z",
    read: false
  },
  {
    id: 3,
    title: "💵 quoc, Ktx RRMS thanh toán 🎉 xong hóa đơn T.5/2026",
    body: "Bánh mì: thanh toán xong hóa đơn T.5/2026, với số tiền: 5.300.000đ, phương thức: Tiền mặt",
    time: "2026-05-09T17:03:55.000000Z",
    read: false
  },
  {
    id: 4,
    title: "💰 quoc, Ktx RRMS lập hóa đơn",
    body: "Bánh mì: lập hóa đơn cho quoc, cho T.5/2026, với số tiền: 5.300.000đ",
    time: "2026-05-09T17:01:00.000000Z",
    read: false
  }
];

const NavAdminLinks = ({ motel, setIsNavAdmin, handleLogout, tokenExists }) => {
  const location = useLocation()
  const id = motel?.motelId
  const accountPath = id ? `/tai-khoan/${id}` : '/tai-khoan'
  const [anchorEl, setAnchorEl] = useState(null)

  const handleNotificationClick = (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const popoverId = open ? 'notification-popover' : undefined

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
    { to: accountPath, icon: <PersonIcon />, label: 'Tài khoản' },
  ]

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      {links.map(({ to, icon, label, onClick }) => (
        <NavLink
          key={label}
          to={to}
          icon={icon}
          label={label}
          isActive={label === 'Tài khoản'
            ? location.pathname === '/tai-khoan' || location.pathname.startsWith('/tai-khoan/')
            : location.pathname === to}
          onClick={onClick}
        />
      ))}

      {/* Notification */}
      <Box
        component="div"
        onClick={handleNotificationClick}
        aria-describedby={popoverId}
        sx={{ ...navLinkSx, position: 'relative', ...(open ? { bgcolor: '#2b7ed7' } : {}) }}
      >
        <NotificationBadge count={0} />
        <Box component="span" sx={{ mt: '5px', fontSize: 14 }}>
          Thông báo
        </Box>
      </Box>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
        slotProps={{
          paper: {
            sx: {
              width: 450,
              maxHeight: 500,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2
            }
          }
        }}
      >
        <List sx={{ p: 0 }}>
          {mockNotifications.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem alignItems="flex-start" sx={{ py: 2, px: 3, '&:hover': { bgcolor: '#f5f5f5' }, cursor: 'pointer' }}>
                <ListItemAvatar sx={{ mt: 0.5, mr: 1 }}>
                  <Badge color="success" variant="dot" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Avatar sx={{ bgcolor: '#f0f0f0', color: '#555' }}>
                      <NotificationsNoneOutlinedIcon />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ component: 'div' }}
                  secondaryTypographyProps={{ component: 'div' }}
                  primary={
                    <Typography component="div" variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 0.5, color: '#333' }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="div" variant="body2" color="text.primary" sx={{ display: 'block', mb: 1 }}>
                        {notification.body}
                      </Typography>
                      <Typography component="div" variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < mockNotifications.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Popover>

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
