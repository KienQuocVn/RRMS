import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined'
import { ACTION_OPTIONS, getDefaultNotificationMessage } from './violationReportData'
import { BORDER, PRIMARY, PRIMARY_HOVER } from './violationReportStyles'

const ViolationResolveModal = ({ open, report, onClose }) => {
  const [action, setAction] = useState('hide')
  const [sendNotification, setSendNotification] = useState(true)
  const [notificationText, setNotificationText] = useState('')
  const [lockDays, setLockDays] = useState(7)
  const currentReport = report || {
    subjectTitle: 'Bài đăng đang chọn',
    reason: 'Lừa đảo'
  }

  useEffect(() => {
    setNotificationText(getDefaultNotificationMessage(action, currentReport))
  }, [action, currentReport])

  const selectedOption = useMemo(() => ACTION_OPTIONS.find((option) => option.value === action), [action])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 0.5,
          boxShadow: 'none'
        }
      }}
      BackdropProps={{ sx: { background: 'rgba(0, 0, 0, 0.45)' } }}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <GppBadOutlinedIcon sx={{ color: '#E24B4A', fontSize: 24, mt: 0.2 }} />
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Xử lý vi phạm</Typography>
              <Typography sx={{ fontSize: 13, color: '#6B7280', mt: 0.25 }}>Bài đăng: {currentReport.subjectTitle}</Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 2.5, pb: 2.25 }}>
        <Stack spacing={2.25}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.25 }}>Hành động xử lý</Typography>
            <Stack spacing={1}>
              {ACTION_OPTIONS.map((option) => {
                const active = action === option.value
                return (
                  <Box
                    key={option.value}
                    onClick={() => setAction(option.value)}
                    sx={{
                      border: active ? `1.5px solid ${PRIMARY}` : BORDER,
                      borderRadius: '8px',
                      p: 1.5,
                      bgcolor: active ? '#F0F9FF' : '#ffffff',
                      cursor: 'pointer'
                    }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Radio checked={active} value={option.value} sx={{ p: 0.25, mt: -0.25 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{option.title}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                          <Typography sx={{ fontSize: 12, color: option.descriptionColor || '#6B7280' }}>{option.description}</Typography>
                          {option.hasDaysInput && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TextField
                                type="number"
                                value={lockDays}
                                onChange={(event) => setLockDays(Math.max(1, Math.min(90, Number(event.target.value) || 1)))}
                                onClick={(event) => event.stopPropagation()}
                                size="small"
                                inputProps={{ min: 1, max: 90 }}
                                sx={{ width: 78, '& .MuiOutlinedInput-root': { height: 34, borderRadius: '8px' } }}
                              />
                              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>ngày</Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Thông báo cho người dùng</Typography>
              <FormControlLabel
                control={<Switch checked={sendNotification} onChange={(event) => setSendNotification(event.target.checked)} />}
                label="Gửi thông báo cho chủ trọ"
                sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: 13 } }}
              />
            </Stack>
            {sendNotification && (
              <TextField
                multiline
                minRows={3}
                value={notificationText}
                onChange={(event) => setNotificationText(event.target.value)}
                sx={{
                  mt: 1.25,
                  width: '100%',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 }
                }}
              />
            )}
          </Box>

          <FormControlLabel
            control={<Checkbox />}
            label="Đánh dấu tất cả báo cáo tương tự đã xử lý"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1.25}>
            <Button variant="outlined" onClick={onClose} sx={{ borderColor: '#D1D5DB', color: '#4B5563', textTransform: 'none', borderRadius: '8px' }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: PRIMARY,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': { bgcolor: PRIMARY_HOVER, boxShadow: 'none' }
              }}>
              Xác nhận xử lý
            </Button>
          </Stack>
          {selectedOption?.value === 'lock' && (
            <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Thời gian khóa hiện tại: {lockDays} ngày.</Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default ViolationResolveModal
