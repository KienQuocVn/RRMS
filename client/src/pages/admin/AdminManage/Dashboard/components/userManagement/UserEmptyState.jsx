import { Box, Button, Stack, Typography } from '@mui/material'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import { BORDER, PRIMARY, PRIMARY_HOVER } from './userManagementUtils'

const UserEmptyState = ({ onReset }) => (
  <Box
    sx={{
      minHeight: 380,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      border: BORDER,
      bgcolor: '#ffffff'
    }}>
    <Stack spacing={1.5} alignItems="center" textAlign="center">
      <Groups2RoundedIcon sx={{ fontSize: 48, color: PRIMARY, opacity: 0.4 }} />
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#111827' }}>Không tìm thấy người dùng</Typography>
      <Typography sx={{ fontSize: 13, color: '#6B7280' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Typography>
      <Button
        variant="outlined"
        onClick={onReset}
        sx={{
          textTransform: 'none',
          color: PRIMARY,
          borderColor: PRIMARY,
          borderRadius: '8px',
          '&:hover': {
            borderColor: PRIMARY_HOVER,
            color: PRIMARY_HOVER,
            backgroundColor: '#F0F9FF'
          }
        }}>
        Xóa bộ lọc
      </Button>
    </Stack>
  </Box>
)

export default UserEmptyState
