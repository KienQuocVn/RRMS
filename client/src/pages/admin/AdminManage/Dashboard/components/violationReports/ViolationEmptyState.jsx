import { Box, Button, Typography } from '@mui/material'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { BORDER, CARD_BG, PRIMARY } from './violationReportStyles'

const ViolationEmptyState = ({ onReset }) => {
  return (
    <Box
      sx={{
        minHeight: 360,
        bgcolor: CARD_BG,
        border: BORDER,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2
      }}>
      <ShieldOutlinedIcon sx={{ fontSize: 48, color: PRIMARY, opacity: 0.4, mb: 1.5 }} />
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#111827' }}>Không có báo cáo nào</Typography>
      <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.75, mb: 2 }}>Tất cả báo cáo đã được xử lý</Typography>
      <Button variant="outlined" onClick={onReset} sx={{ borderColor: PRIMARY, color: PRIMARY, textTransform: 'none', borderRadius: '8px' }}>
        Xem tất cả báo cáo
      </Button>
    </Box>
  )
}

export default ViolationEmptyState
