import { Link, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'

const MENU_ITEMS = [
  {
    key: 'phong',
    path: (id) => `/quanlytro/${id}`,
    label: 'Quản lý phòng',
    icon: <MeetingRoomOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'hoa-don',
    path: (id) => `/quanlytro/${id}/quan-ly-hoa-don`,
    label: 'Hóa đơn',
    icon: <ReceiptOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'dich-vu',
    path: (id) => `/quanlytro/${id}/quan-ly-dich-vu`,
    label: 'Dịch vụ',
    icon: <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'tai-san',
    path: (id) => `/quanlytro/${id}/quan-ly-tai-san`,
    label: 'Tài sản',
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'hop-dong',
    path: (id) => `/quanlytro/${id}/tat-ca-hop-dong`,
    label: 'Hợp đồng',
    icon: <HistoryEduOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'khach-thue',
    path: (id) => `/quanlytro/${id}/tat-ca-khach-thue`,
    label: 'Khách thuê',
    icon: <PeopleAltOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'phuong-tien',
    path: (id) => `/quanlytro/${id}/phuong-tien`,
    label: 'Phương tiện',
    icon: <DirectionsCarIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'thu-chi',
    path: (id) => `/quanlytro/${id}/thu-chi-tong-ket`,
    label: 'Thu/Chi - Tổng kết',
    icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'cai-dat',
    path: (id) => `/quanlytro/${id}/cai-dat-nha-tro`,
    label: 'Cài đặt',
    icon: <SettingsOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'zalo',
    path: (id) => `/quanlytro/${id}/lich-su-gui-zalo`,
    label: 'Lịch sử gửi zalo',
    icon: <SendOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
  {
    key: 'import',
    path: (id) => `/quanlytro/${id}/import-data-from-file`,
    label: 'Nhập liệu từ file',
    icon: <UploadFileOutlinedIcon sx={{ fontSize: 40, color: '#20a9e7' }} />,
  },
]

const menuItemSx = {
  border: '0.5px solid #ccc',
  borderRadius: '10px',
  p: '10px 5px',
  height: '96.5px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  bgcolor: '#fff',
  m: '3px',
  mr: '5px !important',
  width: 140,
  textAlign: 'center',
  flexShrink: 0,
  textDecoration: 'none',
  color: 'black',
}

const menuItemActiveSx = {
  border: '0.5px solid #20a9e7',
  borderBottom: '3px solid #2d9fd3',
  color: '#117cae',
  textDecoration: 'underline',
  boxShadow: '0 0 0 .27rem rgba(51,100,169,.22)',
}

const NavMenuItems = ({ motelId }) => {
  const location = useLocation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,.3)', borderRadius: 3 },
      }}
    >
      {MENU_ITEMS.map(({ key, path, label, icon }) => {
        const to = motelId ? path(motelId) : '#'
        const isActive = location.pathname === to

        return (
          <Box
            key={key}
            component={Link}
            to={to}
            sx={{ ...menuItemSx, ...(isActive ? menuItemActiveSx : {}) }}
          >
            <Box sx={{ textAlign: 'center', mb: '4px', display: 'flex', justifyContent: 'center' }}>
              {icon}
            </Box>
            <Box sx={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>
              {label}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default NavMenuItems
