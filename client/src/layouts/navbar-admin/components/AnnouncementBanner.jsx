import { Box, Link } from '@mui/material'

const AnnouncementBanner = () => (
  <Box sx={{ textAlign: 'center', p: '10px', bgcolor: '#ffe8c8', fontSize: 14 }}>
    RRMS đã có thêm tính năng{' '}
    <strong>gửi hóa đơn tự động cho khách qua ZALO và APP dành riêng khách thuê</strong>. Liên hệ
    chuyên viên qua: <b style={{ color: '#0085ef' }}>HOTLINE: 0907474629</b> hoặc chat{' '}
    <Link href="#" target="_blank" sx={{ color: '#0085ef', fontWeight: 'bold' }}>
      ZALO
    </Link>
  </Box>
)

export default AnnouncementBanner
