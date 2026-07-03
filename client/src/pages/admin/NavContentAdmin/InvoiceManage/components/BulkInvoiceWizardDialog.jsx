import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AdditionItem from '../AdditionItem'

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })

const toDateInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toMonthInput = (year, month) => `${year}-${String(month).padStart(2, '0')}`

const addDays = (dateString, days) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return toDateInput(date)
}

const addMonth = (dateString) => {
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + 1)
  return toDateInput(date)
}

const buildInitialItem = () => ({
  id: Date.now() + Math.random(),
  type: 'SUBTRACT',
  amount: '',
  reason: ''
})

function StepIndicator({ step, active, completed }) {
  return (
    <Box sx={{ flex: 1, position: 'relative', textAlign: 'center' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 11,
          left: step === 1 ? '50%' : 0,
          right: step === 2 ? '50%' : 0,
          height: 1,
          backgroundColor: completed || active ? '#20a9e7' : '#d7dce2'
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 24,
          height: 24,
          mx: 'auto',
          borderRadius: '50%',
          border: '2px solid',
          borderColor: active || completed ? '#20a9e7' : '#d7dce2',
          backgroundColor: '#fff',
          color: active || completed ? '#20a9e7' : '#98a2b3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700
        }}
      >
        {step}
      </Box>
    </Box>
  )
}

function StepRoomCard({ room, selected, onToggle }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2.5,
        borderColor: selected ? '#20a9e7' : '#e5e7eb',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              backgroundColor: '#ececec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}
          >
            <HomeWorkOutlinedIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15 }} noWrap>
              {room.roomName}
            </Typography>
            <Chip
              size="small"
              label="Đang ở"
              sx={{
                mt: 0.6,
                height: 22,
                fontWeight: 700,
                color: '#fff',
                backgroundColor: '#78c850'
              }}
            />
            <Typography sx={{ mt: 0.4, fontSize: 14, color: '#ef4444' }}>
              Đã có ({room.invoiceCount}) trong tháng {room.monthLabel}
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 17, color: '#111827' }}>{formatCurrency(room.roomPrice)}</Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={() => onToggle(room.roomId)}
          sx={{
            minWidth: 88,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 700,
            backgroundColor: selected ? '#15803d' : '#43a047',
            '&:hover': {
              backgroundColor: selected ? '#166534' : '#2e7d32'
            }
          }}
        >
          {selected ? 'Đã chốt' : 'Chốt'}
        </Button>
      </Stack>
    </Paper>
  )
}

function BulkInvoiceWizardDialog({ open, onClose, rooms = [], selectedMonth, selectedYear, onSubmit }) {
  const todayInput = useMemo(() => toDateInput(new Date()), [])
  const [step, setStep] = useState(1)
  const [selectedRoomIds, setSelectedRoomIds] = useState([])
  const [invoiceMonth, setInvoiceMonth] = useState(toMonthInput(selectedYear, selectedMonth))
  const [invoiceDate, setInvoiceDate] = useState(todayInput)
  const [dueDate, setDueDate] = useState(addDays(todayInput, 30))
  const [stayFromDate, setStayFromDate] = useState(todayInput)
  const [stayToDate, setStayToDate] = useState(addMonth(todayInput))
  const [reason, setReason] = useState('Thu tiền hàng tháng')
  const [sendNotification, setSendNotification] = useState(true)
  const [items, setItems] = useState([buildInitialItem()])

  useEffect(() => {
    if (!open) return
    const nextToday = toDateInput(new Date())
    setStep(1)
    setSelectedRoomIds([])
    setInvoiceMonth(toMonthInput(selectedYear, selectedMonth))
    setInvoiceDate(nextToday)
    setDueDate(addDays(nextToday, 30))
    setStayFromDate(nextToday)
    setStayToDate(addMonth(nextToday))
    setReason('Thu tiền hàng tháng')
    setSendNotification(true)
    setItems([buildInitialItem()])
  }, [open, selectedMonth, selectedYear])

  const selectedRooms = useMemo(
    () => rooms.filter((room) => selectedRoomIds.includes(room.roomId)),
    [rooms, selectedRoomIds]
  )

  const selectedRoomTotal = useMemo(
    () => selectedRooms.reduce((total, room) => total + Number(room.roomPrice || 0), 0),
    [selectedRooms]
  )

  const toggleRoom = (roomId) => {
    setSelectedRoomIds((prev) => (prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]))
  }

  const handleAddItem = () => {
    setItems((prev) => [...prev, buildInitialItem()])
  }

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleChangeItem = (index, field, value) => {
    setItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
  }

  const handleNext = () => {
    if (selectedRoomIds.length === 0) return
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = () => {
    onSubmit?.({
      selectedRoomIds,
      invoiceMonth,
      invoiceDate,
      dueDate,
      stayFromDate,
      stayToDate,
      reason,
      sendNotification,
      items
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: '#fff',
          width: 'calc(100vw - 32px)',
          height: 'calc(100vh - 32px)',
          maxWidth: 'none',
          maxHeight: 'none',
          m: 2,
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ borderBottom: '1px solid #edf0f2', px: { xs: 2, md: 3 }, pt: 1.2, pb: 0.8, position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0} sx={{ mx: 'auto', maxWidth: 920 }}>
          <StepIndicator step={1} active={step === 1} completed={step > 1} />
          <StepIndicator step={2} active={step === 2} completed={false} />
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={{ xs: 5, md: 26 }} sx={{ mt: 0.6 }}>
          <Typography sx={{ fontSize: 15, fontWeight: step === 1 ? 700 : 500, color: step === 1 ? '#20a9e7' : '#111827' }}>
            Bước 1: Chốt dịch vụ
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: step === 2 ? 700 : 500, color: step === 2 ? '#20a9e7' : '#111827' }}>
            Bước 2: Lập hóa đơn
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 10,
            top: 8,
            width: 42,
            height: 42,
            border: '1px solid #f4ddd6',
            color: '#111827'
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: '#fff' }}>
        {step === 1 ? (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 1.4fr' }, gap: 2 }}>
              <Stack spacing={1.5}>
                {rooms.length ? (
                  rooms.map((room) => (
                    <StepRoomCard
                      key={room.roomId}
                      room={room}
                      selected={selectedRoomIds.includes(room.roomId)}
                      onToggle={toggleRoom}
                    />
                  ))
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      textAlign: 'center',
                      color: '#6b7280',
                      borderStyle: 'dashed'
                    }}
                  >
                    Không có phòng nào để lập hóa đơn
                  </Paper>
                )}
              </Stack>

              <Paper
                variant="outlined"
                sx={{
                  minHeight: 360,
                  p: 3,
                  borderRadius: 2.5,
                  borderColor: '#b8efc0',
                  backgroundColor: '#efffec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {selectedRooms.length ? (
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 56, color: '#43a047' }} />
                    <Typography sx={{ mt: 1.2, fontSize: 30, fontWeight: 800, color: '#20a9e7' }}>
                      Đã chọn {selectedRooms.length} phòng
                    </Typography>
                    <Typography sx={{ mt: 1, color: '#374151' }}>
                      Tiền phòng tạm tính: <b>{formatCurrency(selectedRoomTotal)}</b>
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1} sx={{ mt: 2 }}>
                      {selectedRooms.map((room) => (
                        <Chip key={room.roomId} label={room.roomName} color="success" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', maxWidth: 540 }}>
                    <Inventory2OutlinedIcon sx={{ fontSize: 40, color: '#2f3b43' }} />
                    <Typography sx={{ mt: 1.2, fontSize: 18, fontWeight: 700, color: '#111827' }}>
                      Thực hiện chốt dịch vụ
                    </Typography>
                    <Typography sx={{ mt: 1, color: '#111827' }}>
                      Vui lòng chọn một &quot;Chốt dịch vụ&quot; từ danh sách phòng để thực hiện chốt dịch vụ
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 1.38fr' }, gap: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  minHeight: 540,
                  p: 3,
                  borderRadius: 2.5,
                  borderColor: '#c6efcc',
                  backgroundColor: '#efffec',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center', maxWidth: 420 }}>
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 64, color: '#43a047' }} />
                  <Typography sx={{ mt: 1.4, fontSize: 22, fontWeight: 800, color: '#20a9e7' }}>
                    Đã chốt {selectedRoomIds.length} phòng
                  </Typography>
                  <Typography sx={{ mt: 1, color: '#374151' }}>
                    Nhập các thông tin bên phải để thực hiện tạo hóa đơn!
                  </Typography>
                </Box>
              </Paper>

              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    type="month"
                    label="Tháng lập phiếu"
                    value={invoiceMonth}
                    onChange={(event) => setInvoiceMonth(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Lý do thu tiền"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="Thu tiền hàng tháng">Thu tiền hàng tháng</MenuItem>
                    <MenuItem value="Thu tiền phát sinh">Thu tiền phát sinh</MenuItem>
                    <MenuItem value="Điều chỉnh hóa đơn">Điều chỉnh hóa đơn</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày lập hóa đơn"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Hạn đóng tiền"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2.5 }}>
                  <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 1.2 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 800 }}>Thông tin ngày ở</Typography>
                    <Typography sx={{ fontSize: 14, fontStyle: 'italic', color: '#4b5563' }}>
                      Nhập thông tin từ ngày đến ngày
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Từ ngày"
                      value={stayFromDate}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        setStayFromDate(nextValue)
                        setStayToDate(addMonth(nextValue))
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      type="date"
                      label="Đến ngày"
                      value={stayToDate}
                      onChange={(event) => setStayToDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1.6,
                    p: 1.6,
                    borderRadius: 1.8,
                    borderColor: '#60d66f',
                    backgroundColor: '#efffec',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#43a047',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography sx={{ color: '#1f2937' }}>
                    <b>Thông tin:</b> Các phòng lập hóa đơn mặc định tính <b>tròn 1 tháng</b>
                  </Typography>
                </Paper>

                <Box sx={{ mt: 2.6 }}>
                  <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 1.2 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 800 }}>Cộng thêm / Giảm trừ:</Typography>
                    <Typography sx={{ fontSize: 14, fontStyle: 'italic', color: '#4b5563' }}>
                      Ví dụ cộng thêm ngày tết, giảm trừ covid...
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 1.6,
                      p: 1.6,
                      borderRadius: 1.8,
                      borderColor: '#ff7a00',
                      backgroundColor: '#fff7f2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: '#ff7a00',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ color: '#1f2937' }}>
                      Chú ý: Cộng thêm / giảm trừ không nên là tiền cọc. Hãy chọn lý do có tiền cọc để nếu cần
                    </Typography>
                  </Paper>

                  <Stack spacing={1.5} sx={{ mt: 1.2 }}>
                    {items.map((item, index) => (
                      <AdditionItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={handleRemoveItem}
                        onChange={handleChangeItem}
                      />
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    startIcon={<PlaylistAddRoundedIcon />}
                    onClick={handleAddItem}
                    sx={{
                      mt: 1.5,
                      minHeight: 44,
                      borderRadius: 1.8,
                      textTransform: 'none',
                      fontWeight: 700,
                      backgroundColor: '#656d78',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#4b5563'
                      }
                    }}
                  >
                    Thêm mục cộng thêm / giảm trừ
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Box sx={{ borderTop: '1px solid #e5e7eb', p: { xs: 2, md: 2.2 }, backgroundColor: '#fff' }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.6,
            borderRadius: 1.8,
            borderColor: '#c5e7c7',
            backgroundColor: '#f5fff5'
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#256b35' }}>
            Tổng phòng đã chốt: {selectedRoomIds.length} phòng
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              mt: 1.2,
              p: 1.3,
              borderRadius: 1.5,
              borderColor: '#c5e7c7',
              backgroundColor: '#fff'
            }}
          >
            <Typography sx={{ fontWeight: 700, color: '#2f6f3e' }}>Chưa có dữ liệu</Typography>
            <Typography sx={{ color: '#2f6f3e' }}>
              {selectedRoomIds.length ? `Đã chọn ${selectedRoomIds.length} phòng để lập hóa đơn.` : 'Chưa có dịch vụ phát sinh.'}
            </Typography>
          </Paper>
        </Paper>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mt: 2 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Checkbox
                checked={sendNotification}
                onChange={(event) => setSendNotification(event.target.checked)}
                sx={{ p: 0.4 }}
              />
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1683ff' }}>Gửi ZALO & APP khách thuê</Typography>
            </Stack>
            <Typography sx={{ mt: 0.5, color: '#ff5b2e' }}>*Lưu ý: Chỉ gửi từ 6h sáng đến 22h tối</Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                minWidth: 52,
                backgroundColor: '#6b7280',
                '&:hover': { backgroundColor: '#4b5563' }
              }}
            >
              <CloseRoundedIcon />
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              sx={{
                backgroundColor: '#ffc928',
                color: '#111827',
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#fbbf24' }
              }}
            >
              Lưu phiên chốt
            </Button>
            {step === 2 ? (
              <Button
                variant="contained"
                startIcon={<ChevronLeftRoundedIcon />}
                onClick={handleBack}
                sx={{
                  backgroundColor: '#7cc642',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#65a30d' }
                }}
              >
                Bước 1: Chốt dịch vụ
              </Button>
            ) : null}
            <Button
              variant="contained"
              startIcon={step === 1 ? <ReceiptLongOutlinedIcon /> : <AddRoundedIcon />}
              endIcon={step === 1 ? <ChevronRightRoundedIcon /> : null}
              onClick={step === 1 ? handleNext : handleSubmit}
              disabled={step === 1 && selectedRoomIds.length === 0}
              sx={{
                backgroundColor: '#43a047',
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#2e7d32' },
                '&.Mui-disabled': {
                  backgroundColor: '#bcd8be',
                  color: '#fff'
                }
              }}
            >
              {step === 1 ? 'Bước 2: Lập hóa đơn' : 'Lập hóa đơn'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default BulkInvoiceWizardDialog
