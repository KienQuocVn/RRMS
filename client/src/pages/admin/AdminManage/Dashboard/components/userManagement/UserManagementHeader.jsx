import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import { PRIMARY, PRIMARY_HOVER } from './userManagementUtils'

const UserManagementHeader = ({ totalUsers, onExport, onAddUser }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    spacing={1.5}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', md: 'center' }}>
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#111827' }}>Quản lý người dùng</Typography>
        <Chip
          label={`${totalUsers.toLocaleString('vi-VN')} người dùng`}
          sx={{
            bgcolor: '#E6F1FB',
            color: '#0C447C',
            height: 28,
            borderRadius: '999px',
            fontSize: 13,
            fontWeight: 500
          }}
        />
      </Stack>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: '#6B7280' }}>
        Quản lý danh sách, trạng thái và quyền hạn của người dùng hệ thống.
      </Typography>
    </Box>

    <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
      <Button
        variant="outlined"
        startIcon={<DownloadRoundedIcon />}
        onClick={onExport}
        sx={{
          textTransform: 'none',
          color: PRIMARY,
          borderColor: PRIMARY,
          borderRadius: '8px',
          px: 2,
          '&:hover': {
            borderColor: PRIMARY_HOVER,
            color: PRIMARY_HOVER,
            backgroundColor: '#F0F9FF'
          }
        }}>
        Xuất danh sách
      </Button>
      <Button
        variant="contained"
        startIcon={<PersonAddAlt1RoundedIcon />}
        onClick={onAddUser}
        sx={{
          textTransform: 'none',
          bgcolor: PRIMARY,
          borderRadius: '8px',
          px: 2,
          boxShadow: 'none',
          '&:hover': {
            bgcolor: PRIMARY_HOVER,
            boxShadow: 'none'
          }
        }}>
        Thêm người dùng
      </Button>
    </Stack>
  </Stack>
)

export default UserManagementHeader
