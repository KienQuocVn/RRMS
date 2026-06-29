import { Box, Button, Typography } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { DASHBOARD_COLORS } from '../constants/dashboardTheme'

const DashboardPageHeader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2,
      mb: 3
    }}>
    <Box>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          color: DASHBOARD_COLORS.textDark,
          lineHeight: 1.3
        }}>
        Tổng quan hệ thống
      </Typography>
      <Typography sx={{ fontSize: 13, color: DASHBOARD_COLORS.textMuted, mt: 0.5 }}>
        Cập nhật nhanh các chỉ số hoạt động chính.
      </Typography>
    </Box>
    <Button
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      sx={{
        textTransform: 'none',
        borderColor: DASHBOARD_COLORS.border,
        color: DASHBOARD_COLORS.textDark,
        borderRadius: '8px',
        fontSize: 13,
        px: 2,
        '&:hover': {
          borderColor: DASHBOARD_COLORS.primary,
          bgcolor: 'rgba(32, 169, 231, 0.04)'
        }
      }}>
      Xuất báo cáo
    </Button>
  </Box>
)

export default DashboardPageHeader
