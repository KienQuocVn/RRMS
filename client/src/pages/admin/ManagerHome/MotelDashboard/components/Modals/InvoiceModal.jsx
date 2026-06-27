import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CloseIcon from '@mui/icons-material/Close'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Swal from 'sweetalert2'
import { createInvoice } from '~/apis/invoiceAPI'
import { normalizeRoomServiceCollection } from '~/utils/apiAdapters'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'

const invoiceReasons = [
  'Thu tiền hằng tháng',
  'Thu tiền tháng đầu tiên',
  'Thu tiền khi kết thúc hợp đồng',
  'Thu tiền phòng chu kỳ',
  'Thu tiền dịch vụ',
  'Thu tiền cọc',
  'Hoàn tiền cọc'
]

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`

const addDays = (dateText, days) => {
  const date = new Date(dateText)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const getMonthText = (dateText) => {
  if (!dateText) return new Date().toISOString().slice(0, 7)
  return dateText.slice(0, 7)
}

const getCycleLabel = (fromDate, toDate) => {
  if (!fromDate || !toDate) return '0 tháng, 0 ngày'

  const from = new Date(fromDate)
  const to = new Date(toDate)
  const diffDays = Math.max(0, Math.round((to - from) / 86400000))
  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30
  return `${months} tháng, ${days} ngày`
}

const SectionTitle = ({ icon, title, subtitle }) => (
  <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ mt: 2.2, mb: 1.2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        bgcolor: '#E8F5E9',
        color: '#172B1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
      {icon}
    </Box>
    <Box sx={{ borderLeft: '4px solid #2b7ed7', pl: 1, minWidth: 0 }}>
      <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{title}</Typography>
      {subtitle ? (
        <Typography variant="body2" sx={{ color: '#5F6368', fontStyle: 'italic', mt: 0.25 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  </Stack>
)

const SummaryBox = ({ leftTitle, leftDetail, rightTitle = 'Thành tiền', amount, detailColor = '#FF4B1F' }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5,
      borderRadius: 1,
      borderColor: '#20a9e7',
      borderLeft: '4px solid #20a9e7',
      bgcolor: '#92cfeb'
    }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: '#374151' }}>
          {leftTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: detailColor, fontWeight: 700, mt: 0.4 }}>
          {leftDetail}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography variant="body2" sx={{ color: '#374151' }}>
          {rightTitle}
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 900, textDecoration: 'underline' }}>{formatCurrency(amount)}</Typography>
      </Box>
    </Stack>
  </Paper>
)

const DateField = ({ label, value, onChange, fullWidth = true }) => (
  <TextField
    fullWidth={fullWidth}
    type="date"
    label={label}
    value={value || ''}
    onChange={(event) => onChange(event.target.value)}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <CalendarMonthOutlinedIcon fontSize="small" />
        </InputAdornment>
      )
    }}
  />
)

const InvoiceModal = ({
  open,
  onClose,
  onCreated,
  room,
  contract,
  roomServices = [],
  deviceDetails = [],
  outstandingDebt = 0
}) => {
  const [additionItems, setAdditionItems] = useState([])
  const [sendZalo, setSendZalo] = useState(true)
  const [invoiceData, setInvoiceData] = useState({
    invoiceCreateMonth: new Date().toISOString().slice(0, 7),
    invoiceCreateDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    dueDateofmoveinDate: '',
    moveinDate: '',
    invoiceReason: 'Thu tiền hằng tháng',
    serviceDetails: [],
    deviceDetails: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    const today = new Date().toISOString().slice(0, 10)
    const startDate = today
    const endDate = addDays(startDate, 31)
    const serviceDetails = normalizeRoomServiceCollection(roomServices)
      .filter((service) => service.isSelected)
      .map((service) => {
        const quantity = Number(service.quantity ?? 1) || 1
        const price = Number(service.service?.price ?? 0) || 0
        return {
          roomServiceId: service.roomServiceId,
          serviceName: service.service?.nameService || 'Dịch vụ',
          servicePrice: price,
          chargetype: service.service?.chargetype || '',
          quantity,
          isSelected: true,
          totalPrice: quantity * price
        }
      })

    setInvoiceData({
      invoiceCreateMonth: getMonthText(today),
      invoiceCreateDate: today,
      dueDate: addDays(today, 30),
      moveinDate: startDate,
      dueDateofmoveinDate: endDate,
      invoiceReason: 'Thu tiền hằng tháng',
      contractId: contract?.contractId || null,
      price: contract?.actualPrice || contract?.price || room?.price || 0,
      serviceDetails,
      deviceDetails
    })
    setAdditionItems([])
    setSendZalo(true)
  }, [open, contract, room, roomServices, deviceDetails])

  const selectedServices = useMemo(
    () => invoiceData.serviceDetails.filter((service) => service.isSelected),
    [invoiceData.serviceDetails]
  )

  const roomAmount = Number(invoiceData.price || 0)
  const serviceAmount = selectedServices.reduce((total, service) => total + Number(service.totalPrice || 0), 0)
  const additionAmount = additionItems.reduce((total, item) => {
    const amount = Number(item.amount || 0)
    return total + (item.isAddition ? amount : -amount)
  }, 0)
  const grandTotal = roomAmount + serviceAmount + additionAmount

  const updateInvoiceField = (field, value) => {
    setInvoiceData((previous) => {
      const next = { ...previous, [field]: value }
      if (field === 'invoiceCreateDate') {
        next.invoiceCreateMonth = getMonthText(value)
        next.dueDate = addDays(value, 30)
      }
      return next
    })
  }

  const updateService = (roomServiceId, updates) => {
    if (updates.quantity !== undefined && isNegativeNumberValue(updates.quantity)) return
    setInvoiceData((previous) => ({
      ...previous,
      serviceDetails: previous.serviceDetails.map((service) => {
        if (service.roomServiceId !== roomServiceId) return service
        const quantity = updates.quantity !== undefined ? Math.max(0, Number(updates.quantity) || 0) : service.quantity
        return {
          ...service,
          ...updates,
          quantity,
          totalPrice: quantity * Number(service.servicePrice || 0)
        }
      })
    }))
  }

  const addAdditionItem = () => {
    setAdditionItems((previous) => [
      ...previous,
      { id: Date.now(), isAddition: true, amount: '', reason: '' }
    ])
  }

  const updateAdditionItem = (id, field, value) => {
    setAdditionItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'amount' ? String(value).replace(/\D/g, '') : value
            }
          : item
      )
    )
  }

  const removeAdditionItem = (id) => {
    setAdditionItems((previous) => previous.filter((item) => item.id !== id))
  }

  const handlePreview = () => {
    Swal.fire({
      icon: 'info',
      title: 'Xem trước hóa đơn',
      html: `
        <div style="text-align:left">
          <p><b>Phòng:</b> ${room?.name || ''}</p>
          <p><b>Tiền phòng:</b> ${formatCurrency(roomAmount)}</p>
          <p><b>Tiền dịch vụ:</b> ${formatCurrency(serviceAmount)}</p>
          <p><b>Cộng/Giảm trừ:</b> ${formatCurrency(additionAmount)}</p>
          <p><b>Tổng cộng:</b> ${formatCurrency(grandTotal)}</p>
        </div>
      `
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (!invoiceData.contractId) {
        throw new Error('Phòng này chưa có hợp đồng để lập hóa đơn.')
      }

      const payload = {
        contractId: invoiceData.contractId,
        invoiceReason: invoiceData.invoiceReason,
        invoiceCreateMonth: invoiceData.invoiceCreateMonth,
        invoiceCreateDate: invoiceData.invoiceCreateDate,
        dueDate: invoiceData.dueDate,
        dueDateofmoveinDate: invoiceData.dueDateofmoveinDate,
        serviceDetails: selectedServices.map((service) => ({
          roomServiceId: service.roomServiceId,
          quantity: Number(service.quantity || 1)
        })),
        deviceDetails: invoiceData.deviceDetails || [],
        additionItems: additionItems.map((item) => ({
          reason: item.reason || 'Chưa có lý do',
          amount: Number(item.amount || 0),
          isAddition: Boolean(item.isAddition)
        })),
        sendZalo
      }

      const response = await createInvoice(payload)
      const createdInvoice = response?.result || response

      if (onCreated) {
        onCreated(createdInvoice)
      } else {
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Hóa đơn đã được lập thành công!' })
        onClose()
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: error?.response?.data?.message || error.message || 'Lập hóa đơn không thành công!'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          maxWidth: '100%',
          height: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '100%', sm: '94vh' },
          m: { xs: 0, sm: 2 },
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden'
        }
      }}>
      <Box sx={{ px: 1.5, py: 1.2, borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#20a9e7',
                border: '4px solid #20a9e7',
                color: '#123D24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <PaidOutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Lập hóa đơn cho &quot;{room?.name}&quot;</Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{ border: '3px solid #FBE6DE', width: 42, height: 42, color: '#111827' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 1.5, bgcolor: '#fff' }}>
        <Stack spacing={1.2}>
          {Number(outstandingDebt || 0) > 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 1.4,
                borderRadius: 1,
                bgcolor: '#FFF8E8',
                borderColor: '#FFB4B4'
              }}>
              <Typography sx={{ fontWeight: 900, color: '#111' }}>
                Tiền khách nợ{' '}
                <Box component="span" sx={{ color: '#FF0000', fontSize: 18 }}>
                  {formatCurrency(outstandingDebt)}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ color: '#111', mt: 0.5 }}>
                Bạn vẫn tiếp tục lập hóa đơn?
              </Typography>
            </Paper>
          ) : null}

          <TextField
            select
            fullWidth
            label="Lý do thu tiền *"
            value={invoiceData.invoiceReason}
            onChange={(event) => updateInvoiceField('invoiceReason', event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '&.Mui-focused fieldset': { borderWidth: 2 }
              }
            }}>
            {invoiceReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ height: 1, bgcolor: '#D1D5DB', my: 0.4 }} />

          <DateField
            label="Tháng lập phiếu *"
            value={`${invoiceData.invoiceCreateMonth}-01`}
            onChange={(value) => updateInvoiceField('invoiceCreateMonth', getMonthText(value))}
          />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DateField
                label="Ngày lập hóa đơn *"
                value={invoiceData.invoiceCreateDate}
                onChange={(value) => updateInvoiceField('invoiceCreateDate', value)}
              />
            </Grid>
            <Grid item xs={6}>
              <DateField
                label="Hạn đóng tiền *"
                value={invoiceData.dueDate}
                onChange={(value) => updateInvoiceField('dueDate', value)}
              />
            </Grid>
          </Grid>

          <SectionTitle
            icon={<HomeOutlinedIcon />}
            title="Thu tiền hằng tháng"
            subtitle={
              <>
                Ngày vào: <Box component="span" sx={{ color: '#FF4B1F', fontWeight: 800 }}>{contract?.moveInDate || contract?.moveinDate || 'Chưa có'}</Box>. Chu kỳ thu: <Box component="span" sx={{ color: '#FF4B1F' }}>{contract?.collectionCycle || contract?.collectioncycle || 1} tháng, ngày 1 thu</Box>
              </>
            }
          />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DateField
                label="Từ ngày *"
                value={invoiceData.moveinDate}
                onChange={(value) => updateInvoiceField('moveinDate', value)}
              />
            </Grid>
            <Grid item xs={6}>
              <DateField
                label="Đến ngày *"
                value={invoiceData.dueDateofmoveinDate}
                onChange={(value) => updateInvoiceField('dueDateofmoveinDate', value)}
              />
            </Grid>
          </Grid>

          <SummaryBox
            leftTitle="Thu tiền hằng tháng"
            leftDetail={`${getCycleLabel(invoiceData.moveinDate, invoiceData.dueDateofmoveinDate)} x ${formatCurrency(roomAmount)}`}
            amount={roomAmount}
          />

          <SectionTitle
            icon={<Inventory2OutlinedIcon />}
            title="Tiền dịch vụ"
            subtitle="Tính tiền dịch vụ khách xài"
          />

          <Stack spacing={1}>
            {invoiceData.serviceDetails.map((service) => (
              <Paper
                key={service.roomServiceId}
                variant="outlined"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  borderColor: '#1769FF',
                  bgcolor: service.isSelected ? '#fff' : '#F9FAFB'
                }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox
                    checked={Boolean(service.isSelected)}
                    onChange={(event) => updateService(service.roomServiceId, { isSelected: event.target.checked })}
                    sx={{ p: 0.5 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>
                      {service.serviceName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#374151' }}>
                      Giá: <Box component="span" sx={{ fontWeight: 800, textDecoration: 'underline' }}>{formatCurrency(service.servicePrice)}</Box> / {service.chargetype}
                    </Typography>
                  </Box>
                  <TextField
                    size="small"
                    type="number"
                    value={service.quantity}
                    disabled={!service.isSelected}
                    onChange={(event) => updateService(service.roomServiceId, { quantity: event.target.value })}
                    sx={{ width: 180 }}
                    {...getNonNegativeNumberFieldProps()}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{service.chargetype}</InputAdornment>
                    }}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>

          <SummaryBox
            leftTitle="Tính tiền dịch vụ"
            leftDetail={`${selectedServices.length} dịch vụ`}
            amount={serviceAmount}
          />

          <SectionTitle
            icon={<Inventory2OutlinedIcon />}
            title="Cộng thêm / Giảm trừ:"
            subtitle="Ví dụ giảm ngày tết, giảm trừ covid, thêm tiền phạt..."
          />

          <Alert
            icon={<InfoOutlinedIcon />}
            severity="warning"
            sx={{ bgcolor: '#FFF7ED', border: '1px solid #FF5C00', color: '#374151' }}>
            Chú ý: Cộng thêm / giảm trừ không nên là tiền cọc. Hãy chọn lý do có tiền cọc để nếu cần
          </Alert>

          <Stack spacing={1}>
            {additionItems.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ borderColor: '#1769FF', borderRadius: 1, overflow: 'hidden' }}>
                <Grid container>
                  <Grid item xs={3}>
                    <Stack sx={{ height: '100%', borderRight: '1px solid #D1D5DB' }}>
                      <FormControlLabel
                        sx={{ m: 0, px: 1, py: 1 }}
                        control={
                          <Radio
                            checked={item.isAddition}
                            onChange={() => updateAdditionItem(item.id, 'isAddition', true)}
                          />
                        }
                        label="Cộng [+]"
                      />
                      <FormControlLabel
                        sx={{ m: 0, px: 1, py: 1, borderTop: '1px solid #E5E7EB' }}
                        control={
                          <Radio
                            checked={!item.isAddition}
                            onChange={() => updateAdditionItem(item.id, 'isAddition', false)}
                          />
                        }
                        label="Giảm [-]"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Số tiền (đ) *"
                      value={item.amount}
                      onChange={(event) => updateAdditionItem(item.id, 'amount', event.target.value)}
                      InputProps={{ disableUnderline: true }}
                      sx={{ px: 1.5, py: 1.5, borderBottom: '1px solid #E5E7EB' }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={1}
                      variant="standard"
                      placeholder="Lý do *"
                      value={item.reason}
                      onChange={(event) => updateAdditionItem(item.id, 'reason', event.target.value)}
                      InputProps={{ disableUnderline: true }}
                      sx={{ px: 1.5, py: 1.2 }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      onClick={() => removeAdditionItem(item.id)}
                      sx={{ height: '100%', bgcolor: '#FFF0EA', color: 'red', borderRadius: 0 }}>
                      Xóa
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Button
            fullWidth
            startIcon={<AddIcon />}
            onClick={addAdditionItem}
            variant="contained"
            color="inherit"
            sx={{ bgcolor: '#737B83', color: '#fff', fontWeight: 800, py: 1.2, '&:hover': { bgcolor: '#626A72' } }}>
            Thêm mục cộng thêm / giảm trừ
          </Button>

          <SummaryBox
            leftTitle={additionAmount >= 0 ? 'Cộng thêm' : 'Giảm trừ'}
            leftDetail={`Lý do: ${additionItems.find((item) => item.reason)?.reason || 'Chưa có lý do'}`}
            amount={additionAmount}
            detailColor="#374151"
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 1.5,
          borderTop: '1px solid #E5E7EB',
          bgcolor: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 1
        }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <FormControlLabel
                sx={{ m: 0 }}
                control={<Checkbox checked={sendZalo} onChange={(event) => setSendZalo(event.target.checked)} />}
                label={
                  <Typography variant="body2" sx={{ color: '#0B73FF', fontWeight: 800 }}>
                    Gửi ZALO & APP khách thuê
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ color: '#FF3D00', display: 'block', pl: 3 }}>
                *Lưu ý: Chỉ gửi từ 6h sáng đến 22h tối
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography variant="body2">Tổng cộng</Typography>
              <Typography sx={{ color: '#20a9e7', fontSize: 20, fontWeight: 900, textDecoration: 'underline' }}>
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.8} justifyContent="flex-end">
            <Button variant="contained" color="inherit" onClick={onClose} sx={{ bgcolor: '#737B83', color: '#fff' }}>
              Hủy bỏ
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={handlePreview}
              sx={{ bgcolor: '#ffffff', fontWeight: 800 }}>
              Xem trước
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disabled={loading}
              onClick={handleSubmit}
              sx={{ fontWeight: 900 }}>
              {loading ? 'Đang thêm...' : 'Thêm hóa đơn'}
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceModal
