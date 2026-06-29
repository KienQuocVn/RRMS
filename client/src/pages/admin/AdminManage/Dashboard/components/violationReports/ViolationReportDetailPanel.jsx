import { useMemo, useState } from 'react'
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
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import { BORDER, CARD_BG, PRIMARY, REASON_STYLES, SEVERITY_STYLES, STATUS_STYLES } from './violationReportStyles'

const chipSx = (style, overrides = {}) => ({
  height: 28,
  borderRadius: '999px',
  bgcolor: style.background,
  color: style.color,
  fontSize: 12,
  fontWeight: 500,
  ...overrides
})

const DetailLabel = ({ children }) => (
  <Typography sx={{ fontSize: 11, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.05em', fontWeight: 600 }}>
    {children}
  </Typography>
)

const ViolationReportDetailPanel = ({ report, onClose }) => {
  const [showAllReporters, setShowAllReporters] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const visibleReporters = useMemo(
    () => (showAllReporters ? report.reporters : report.reporters.slice(0, 4)),
    [report.reporters, showAllReporters]
  )

  return (
    <Box
      sx={{
        position: { lg: 'sticky' },
        top: { lg: 16 },
        maxHeight: { lg: 'calc(100vh - 96px)' },
        overflow: 'auto',
        bgcolor: CARD_BG,
        border: BORDER,
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Chi tiết báo cáo</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip label={report.severity} sx={chipSx({ background: '#FCEBEB', color: '#791F1F' }, { fontSize: 13, px: 0.75, height: 32 })} />
          <ArrowForwardRoundedIcon sx={{ color: '#9CA3AF', fontSize: 18 }} />
          <Chip label={report.status} sx={chipSx(STATUS_STYLES[report.status])} />
        </Stack>
        <Typography sx={{ fontSize: 12, color: '#6B7280', textAlign: 'right' }}>{report.createdAtLabel}</Typography>
      </Stack>

      <Stack spacing={1.25}>
        <DetailLabel>Đối tượng bị báo cáo</DetailLabel>
        <Box sx={{ bgcolor: '#F9FAFB', borderRadius: '8px', p: 1.5 }}>
          <Stack direction="row" spacing={1.5}>
            {report.subjectImage ? (
              <Box component="img" src={report.subjectImage} alt={report.subjectTitle} sx={{ width: 56, height: 56, borderRadius: '12px', objectFit: 'cover' }} />
            ) : (
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#E6F1FB', color: '#0C447C', fontSize: 18 }}>{report.subjectTitle.slice(0, 2).toUpperCase()}</Avatar>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }} noWrap>
                {report.subjectTitle}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7280', mt: 0.5 }} noWrap>
                {report.subjectAddress}
              </Typography>
              <Chip label={report.subjectPrice} size="small" sx={{ mt: 1, bgcolor: '#E6F4FB', color: PRIMARY, fontWeight: 600, borderRadius: '999px' }} />
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.25 }}>
            <Button size="small" endIcon={<ArrowForwardRoundedIcon />} sx={{ color: PRIMARY, textTransform: 'none', fontSize: 12 }}>
              Xem bài đăng
            </Button>
          </Box>
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <DetailLabel>Thống kê</DetailLabel>
        <Stack direction={{ xs: 'column', sm: 'row', lg: 'column', xl: 'row' }} spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FlagOutlinedIcon sx={{ color: '#E24B4A', fontSize: 18 }} />
            <Typography sx={{ fontSize: 13 }}>{report.reportCount} lần bị báo cáo</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PeopleOutlineRoundedIcon sx={{ color: '#6B7280', fontSize: 18 }} />
            <Typography sx={{ fontSize: 13 }}>{report.stats.uniqueReporters} người khác nhau</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarTodayOutlinedIcon sx={{ color: '#6B7280', fontSize: 18 }} />
            <Typography sx={{ fontSize: 13 }}>Lần đầu: {report.stats.firstReportedAt}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <DetailLabel>Người báo cáo ({report.reporters.length})</DetailLabel>
        <Stack spacing={1} sx={{ maxHeight: 180, overflow: 'auto', pr: 0.5 }}>
          {visibleReporters.map((reporter) => (
            <Stack key={reporter.id} direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: '#DBEAFE', color: '#1D4ED8' }}>{reporter.initials}</Avatar>
                <Typography sx={{ fontSize: 13 }} noWrap>
                  {reporter.name}
                </Typography>
                <Chip label={reporter.reason} size="small" sx={chipSx(REASON_STYLES[reporter.reason] || REASON_STYLES.Spam, { height: 24, fontSize: 11 })} />
              </Stack>
              <Typography sx={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{reporter.timeAgo}</Typography>
            </Stack>
          ))}
        </Stack>
        {report.reporters.length > 4 && (
          <Button size="small" onClick={() => setShowAllReporters((prev) => !prev)} sx={{ alignSelf: 'flex-start', color: PRIMARY, textTransform: 'none', px: 0 }}>
            {showAllReporters ? 'Thu gọn danh sách' : `Xem thêm ${report.reporters.length - 4} báo cáo`}
          </Button>
        )}
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <DetailLabel>Nội dung báo cáo mới nhất</DetailLabel>
        <Box sx={{ bgcolor: '#F9FAFB', borderLeft: `3px solid ${PRIMARY}`, borderRadius: '0 8px 8px 0', p: '10px 14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>{report.lastReporter.name} viết:</Typography>
          <Typography
            sx={{
              fontSize: 13,
              fontStyle: 'italic',
              color: '#4B5563',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitLineClamp: showFullContent ? 'unset' : 3,
              WebkitBoxOrient: 'vertical'
            }}>
            {report.latestContent}
          </Typography>
          {report.latestContent.length > 120 && (
            <Button size="small" onClick={() => setShowFullContent((prev) => !prev)} sx={{ mt: 0.5, px: 0, color: PRIMARY, textTransform: 'none' }}>
              {showFullContent ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          )}
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={1.25}>
        <DetailLabel>Lịch sử</DetailLabel>
        {report.reportHistory.length > 0 ? (
          <Stack spacing={1.25}>
            {report.reportHistory.map((item) => (
              <Stack key={`${item.label}-${item.time}`} direction="row" spacing={1.25} alignItems="flex-start">
                <Box sx={{ width: 10, height: 10, mt: '5px', borderRadius: '999px', bgcolor: item.color, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ fontSize: 13 }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{item.time}</Typography>
                </Box>
              </Stack>
            ))}
            {report.status !== 'Đã xử lý' && <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>Chưa có hành động xử lý</Typography>}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>Chưa có hành động xử lý</Typography>
        )}
      </Stack>

      <Stack spacing={1}>
        <DetailLabel>Ghi chú xử lý</DetailLabel>
        <TextField
          multiline
          minRows={3}
          placeholder="Thêm ghi chú nội bộ..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: 13,
              bgcolor: '#ffffff',
              '& fieldset': { border: BORDER }
            }
          }}
        />
        <Typography sx={{ fontSize: 11, color: '#6B7280', fontStyle: 'italic' }}>Ghi chú chỉ admin thấy được</Typography>
      </Stack>

      <Box sx={{ position: 'sticky', bottom: -16, bgcolor: '#ffffff', pt: 1.5, mt: 'auto', borderTop: BORDER }}>
        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button fullWidth variant="contained" startIcon={<VisibilityOffOutlinedIcon />} sx={{ bgcolor: '#E24B4A', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#C73A39', boxShadow: 'none' } }}>
              Ẩn nội dung
            </Button>
            <Button fullWidth variant="contained" startIcon={<NotificationsActiveOutlinedIcon />} sx={{ bgcolor: '#BA7517', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#9A5D10', boxShadow: 'none' } }}>
              Cảnh cáo người dùng
            </Button>
            <Button fullWidth variant="outlined" startIcon={<HighlightOffRoundedIcon />} sx={{ color: '#6B7280', borderColor: '#D1D5DB', textTransform: 'none' }}>
              Bỏ qua báo cáo
            </Button>
          </Stack>
          {report.severity === 'Nghiêm trọng' && (
            <Button fullWidth variant="outlined" startIcon={<LockOutlinedIcon />} sx={{ height: 38, borderRadius: '8px', borderColor: '#E24B4A', color: '#E24B4A', textTransform: 'none' }}>
              Khóa tài khoản vi phạm
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default ViolationReportDetailPanel
