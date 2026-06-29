import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import { BORDER, PRIMARY, PRIMARY_HOVER, getInitials, getRoleStyle, getStatusStyle, formatDate, formatRelativeTime } from './userManagementUtils'

const infoRow = (icon, label, value, extra) => (
  <Stack direction="row" spacing={1.25} alignItems="flex-start">
    <Box sx={{ color: '#9CA3AF', mt: 0.1 }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{label}</Typography>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography sx={{ fontSize: 13, color: '#111827' }}>{value}</Typography>
        {extra}
      </Stack>
    </Box>
  </Stack>
)

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, color: '#6B7280', fontWeight: 600 }}>
    {children}
  </Typography>
)

const UserDetailsPanel = ({ user, note, onNoteChange, onClose, onEditUser, onToggleLock }) => {
  if (!user) return null

  const roleStyle = getRoleStyle(user.role)
  const statusStyle = getStatusStyle(user.status)

  return (
    <Box
      sx={{
        position: { xl: 'sticky' },
        top: { xl: 16 },
        maxHeight: { xl: 'calc(100vh - 110px)' },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: BORDER,
        bgcolor: '#ffffff',
        overflow: 'hidden'
      }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>Thông tin người dùng</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
        <Box sx={{ bgcolor: '#F9FAFB', borderRadius: '10px', p: 2, textAlign: 'center' }}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1.5,
              border: `2px solid ${PRIMARY}`,
              bgcolor: '#DCEEFF',
              color: '#0C447C',
              fontSize: 20,
              fontWeight: 600
            }}>
            {getInitials(user.fullName)}
          </Avatar>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{user.fullName}</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip label={user.role} sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, borderRadius: '999px', fontWeight: 500 }} />
            <Chip label={user.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', fontWeight: 500 }} />
          </Stack>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
            {[
              { label: 'Bài đăng', value: user.postsCount },
              { label: 'Lượt xem', value: user.profileViews },
              { label: 'Vi phạm', value: user.violationCount }
            ].map((item) => (
              <Box key={item.label} sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{item.value}</Typography>
                <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{item.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <SectionLabel>Thông tin cơ bản</SectionLabel>
          {infoRow(<MailOutlineRoundedIcon sx={{ fontSize: 16 }} />, 'Email', user.email)}
          {infoRow(<PhoneIphoneRoundedIcon sx={{ fontSize: 16 }} />, 'Số điện thoại', user.phone)}
          {infoRow(<PlaceOutlinedIcon sx={{ fontSize: 16 }} />, 'Địa chỉ', user.address)}
          {infoRow(<CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />, 'Ngày tham gia', formatDate(user.createdAt))}
          {infoRow(<ScheduleRoundedIcon sx={{ fontSize: 16 }} />, 'Đăng nhập cuối', formatRelativeTime(user.lastLoginAt))}
          {infoRow(
            <VerifiedUserRoundedIcon sx={{ fontSize: 16 }} />,
            'Xác minh CMND',
            user.verifiedIdentity ? 'Đã xác minh' : 'Chưa xác minh',
            <Chip
              label={user.verifiedIdentity ? 'Đã xác minh' : 'Chưa xác minh'}
              sx={{
                height: 22,
                bgcolor: user.verifiedIdentity ? '#EAF3DE' : '#FAEEDA',
                color: user.verifiedIdentity ? '#27500A' : '#633806',
                fontSize: 11
              }}
            />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <SectionLabel>Hoạt động gần đây</SectionLabel>
          {user.recentActivities.slice(0, 4).map((activity) => (
            <Stack key={activity.id} direction="row" spacing={1.25} justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                <Box sx={{ width: 8, height: 8, mt: 0.8, borderRadius: '50%', bgcolor: activity.color }} />
                <Typography sx={{ fontSize: 13, color: '#111827' }}>{activity.title}</Typography>
              </Stack>
              <Typography sx={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>{activity.time}</Typography>
            </Stack>
          ))}
          <Button sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', color: PRIMARY, '&:hover': { bgcolor: 'transparent', color: PRIMARY_HOVER } }}>
            Xem toàn bộ lịch sử →
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <SectionLabel>Bài đăng ({user.postsCount})</SectionLabel>
          {user.posts.slice(0, 3).map((post) => (
            <Stack key={post.id} direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: `${post.accent}20`, border: BORDER }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: 12, fontWeight: 500 }}>{post.title}</Typography>
                <Chip label={post.status} size="small" sx={{ mt: 0.5, height: 22, fontSize: 11, bgcolor: '#F3F4F6' }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: PRIMARY, fontWeight: 600 }}>{post.price}</Typography>
            </Stack>
          ))}
          <Button sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', color: PRIMARY, '&:hover': { bgcolor: 'transparent', color: PRIMARY_HOVER } }}>
            Xem tất cả bài đăng →
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.25}>
          <SectionLabel>Ghi chú admin</SectionLabel>
          <TextField
            multiline
            minRows={3}
            placeholder="Thêm ghi chú nội bộ về người dùng..."
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="outlined"
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
              Lưu ghi chú
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 2, borderTop: BORDER, bgcolor: '#ffffff' }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEditUser(user)}
              sx={{
                flex: 1,
                textTransform: 'none',
                color: PRIMARY,
                borderColor: PRIMARY,
                borderRadius: '8px',
                '&:hover': { borderColor: PRIMARY_HOVER, color: PRIMARY_HOVER, backgroundColor: '#F0F9FF' }
              }}>
              Chỉnh sửa thông tin
            </Button>
            <Button
              variant="outlined"
              startIcon={<LockOutlinedIcon />}
              onClick={() => onToggleLock(user)}
              sx={{
                flex: 1,
                textTransform: 'none',
                color: '#E24B4A',
                borderColor: '#E24B4A',
                borderRadius: '8px',
                '&:hover': { borderColor: '#C73939', color: '#C73939', backgroundColor: '#FFF5F5' }
              }}>
              Khóa tài khoản
            </Button>
          </Stack>
          <Button
            startIcon={<KeyRoundedIcon />}
            sx={{
              textTransform: 'none',
              color: PRIMARY,
              justifyContent: 'center',
              borderTop: BORDER,
              borderRadius: 0,
              pt: 1,
              '&:hover': { bgcolor: 'transparent', color: PRIMARY_HOVER }
            }}>
            Đặt lại mật khẩu
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default UserDetailsPanel
