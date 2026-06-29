import { Box, Button, Chip, Typography } from '@mui/material'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import { DASHBOARD_COLORS } from '../../Dashboard/constants/dashboardTheme'

const PostApprovalHeader = ({ pendingCount, onApproveAll }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', md: 'center' },
      flexDirection: { xs: 'column', md: 'row' },
      gap: 1.5
    }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
      <Typography sx={{ fontSize: 20, fontWeight: 500, color: DASHBOARD_COLORS.textDark }}>
        Duyệt bài đăng
      </Typography>
      <Chip
        label={`${pendingCount} bài đang chờ duyệt`}
        size="small"
        sx={{
          height: 24,
          bgcolor: '#FAEEDA',
          color: '#BA7517',
          borderRadius: '999px',
          fontSize: 12,
          fontWeight: 500
        }}
      />
    </Box>

    <Button
      variant="contained"
      startIcon={<DoneAllOutlinedIcon />}
      onClick={onApproveAll}
      sx={{
        textTransform: 'none',
        px: 2,
        py: 1,
        borderRadius: '8px',
        bgcolor: DASHBOARD_COLORS.primary,
        boxShadow: 'none',
        '&:hover': {
          bgcolor: DASHBOARD_COLORS.primaryHover,
          boxShadow: 'none'
        }
      }}>
      Duyệt tất cả
    </Button>
  </Box>
)

export default PostApprovalHeader
