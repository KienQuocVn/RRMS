import { Link, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

const MENU_ITEMS = [
  {
    key: 'phong',
    path: (id) => `/quanlytro/${id}`,
    label: 'Quản lý phòng',
    img: '/billicon.png',
  },
  {
    key: 'hoa-don',
    path: (id) => `/quanlytro/${id}/quan-ly-hoa-don`,
    label: 'Quản lý hóa đơn',
    img: '/billicon.png',
  },
  {
    key: 'dich-vu',
    path: (id) => `/quanlytro/${id}/quan-ly-dich-vu`,
    label: 'Quản lý dịch vụ',
    img: '/billpen.png',
  },
  {
    key: 'tai-san',
    path: (id) => `/quanlytro/${id}/quan-ly-tai-san`,
    label: 'Quản lý tài sản',
    img: '/billpen.png',
  },
  {
    key: 'hop-dong',
    path: (id) => `/quanlytro/${id}/tat-ca-hop-dong`,
    label: 'Quản lý hợp đồng',
    img: '/contractbill.png',
  },
  {
    key: 'khach-thue',
    path: (id) => `/quanlytro/${id}/tat-ca-khach-thue`,
    label: 'Quản lý khách thuê',
    img: '/phonebill.png',
  },
  {
    key: 'thu-chi',
    path: (id) => `/quanlytro/${id}/thu-chi-tong-ket`,
    label: 'Thu/Chi - Tổng kết',
    img: '/billpen.png',
  },
  {
    key: 'cai-dat',
    path: (id) => `/quanlytro/${id}/cai-dat-nha-tro`,
    label: 'Cài đặt',
    img: '/setting.png',
  },
  {
    key: 'zalo',
    path: (id) => `/quanlytro/${id}/lich-su-gui-zalo`,
    label: 'Lịch sử gửi zalo',
    img: '/icon/icon-zalo.png',
  },
  {
    key: 'import',
    path: (id) => `/quanlytro/${id}/import-data-from-file`,
    label: 'Nhập liệu từ file',
    img: '/setting.png',
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
      {MENU_ITEMS.map(({ key, path, label, img }) => {
        const to = motelId ? path(motelId) : '#'
        const isActive = location.pathname === to

        return (
          <Box
            key={key}
            component={Link}
            to={to}
            sx={{ ...menuItemSx, ...(isActive ? menuItemActiveSx : {}) }}
          >
            <Box sx={{ textAlign: 'center', mb: '4px' }}>
              <Box component="img" src={img} sx={{ width: 47, mb: 1 }} />
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
