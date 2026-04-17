import { Link, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

const MENU_ITEMS = [
  {
    key: 'phong',
    path: (id) => `/quanlytro/${id}`,
    label: 'Quản lý phòng',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbillicon.png?alt=media&token=3b38557e-411a-484f-ad52-436f4b86f40f',
  },
  {
    key: 'hoa-don',
    path: (id) => `/quanlytro/${id}/quan-ly-hoa-don`,
    label: 'Quản lý hóa đơn',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbillicon.png?alt=media&token=3b38557e-411a-484f-ad52-436f4b86f40f',
  },
  {
    key: 'dich-vu',
    path: (id) => `/quanlytro/${id}/quan-ly-dich-vu`,
    label: 'Quản lý dịch vụ',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbillpen.png?alt=media&token=69d5c964-0b06-4d3e-a376-058984b882e8',
  },
  {
    key: 'tai-san',
    path: (id) => `/quanlytro/${id}/quan-ly-tai-san`,
    label: 'Quản lý tài sản',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbillpen.png?alt=media&token=69d5c964-0b06-4d3e-a376-058984b882e8',
  },
  {
    key: 'hop-dong',
    path: (id) => `/quanlytro/${id}/tat-ca-hop-dong`,
    label: 'Quản lý hợp đồng',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fcontractbill.png?alt=media&token=13951a47-8b49-48bb-94e5-41bbcd7ce10f',
  },
  {
    key: 'khach-thue',
    path: (id) => `/quanlytro/${id}/tat-ca-khach-thue`,
    label: 'Quản lý khách thuê',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fphonebill.png?alt=media&token=93ff2462-c893-451d-a105-dff4d0582d3a',
  },
  {
    key: 'thu-chi',
    path: (id) => `/quanlytro/${id}/thu-chi-tong-ket`,
    label: 'Thu/Chi - Tổng kết',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbillpen.png?alt=media&token=69d5c964-0b06-4d3e-a376-058984b882e8',
  },
  {
    key: 'cai-dat',
    path: (id) => `/quanlytro/${id}/cai-dat-nha-tro`,
    label: 'Cài đặt',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fsetting.png?alt=media&token=22b2f416-5de5-4f06-b70d-2c0c0152409d',
  },
  {
    key: 'zalo',
    path: (id) => `/quanlytro/${id}/lich-su-gui-zalo`,
    label: 'Lịch sử gửi zalo',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Ficon-zalo.png?alt=media&token=536280c6-77d6-4368-afe9-e0c0c6bdbf0f',
  },
  {
    key: 'import',
    path: (id) => `/quanlytro/${id}/import-data-from-file`,
    label: 'Nhập liệu từ file',
    img: 'https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fsetting.png?alt=media&token=22b2f416-5de5-4f06-b70d-2c0c0152409d',
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
