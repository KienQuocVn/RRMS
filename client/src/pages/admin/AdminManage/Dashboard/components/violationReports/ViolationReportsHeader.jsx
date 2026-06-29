import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { BORDER, PRIMARY, PRIMARY_HOVER } from './violationReportStyles'

const ViolationReportsHeader = () => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#111827' }}>Báo cáo vi phạm</Typography>
        <Chip
          label="3 chờ xử lý"
          size="small"
          sx={{
            height: 28,
            px: 0.75,
            bgcolor: '#FCEBEB',
            color: '#791F1F',
            borderRadius: '999px',
            fontSize: 13,
            fontWeight: 500
          }}
        />
      </Box>

      <Button
        variant="outlined"
        startIcon={<DownloadRoundedIcon />}
        sx={{
          height: 38,
          borderRadius: '8px',
          border: BORDER,
          borderColor: PRIMARY,
          color: PRIMARY,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            borderColor: PRIMARY_HOVER,
            color: PRIMARY_HOVER,
            bgcolor: '#ffffff'
          }
        }}>
        Xuất báo cáo
      </Button>
    </Stack>
  )
}

export default ViolationReportsHeader
