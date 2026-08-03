import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import CloseIcon from '@mui/icons-material/Close'
import { useParams } from 'react-router-dom'
import { createBroker, updateBroker } from '~/apis/brokerAPI'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'

const getInitialData = (motelId, broker) => ({
  motelId,
  name: broker?.name || '',
  phone: broker?.phone || '',
  source: broker?.source || '',
  commissionRate: broker?.commissionRate ?? 0,
  createAccount: false
})

const BrokerModal = ({ handleClose, open, refreshBrokers, broker }) => {
  const { motelId } = useParams()
  const isEditing = Boolean(broker?.brokerId)
  const [data, setData] = useState(() => getInitialData(motelId, broker))
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const title = useMemo(() => (isEditing ? 'Chỉnh sửa môi giới' : 'Thêm môi giới'), [isEditing])

  useEffect(() => {
    if (open) {
      setData(getInitialData(motelId, broker))
      setErrorMessage('')
    }
  }, [broker, motelId, open])

  const handleSubmit = async () => {
    if (!data.name.trim() || !data.phone.trim()) {
      setErrorMessage('Vui lòng nhập tên và số điện thoại môi giới.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMessage('')

      if (isEditing) {
        await updateBroker(broker.brokerId, data)
      } else {
        await createBroker(data)
      }

      await refreshBrokers()
      handleCloseReset()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Không thể lưu thông tin môi giới. Vui lòng thử lại.')
      console.error('Error saving broker:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseReset = () => {
    setData(getInitialData(motelId, null))
    setErrorMessage('')
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : handleCloseReset}
      sx={{
        '& .MuiDialog-paper': {
          width: '560px',
          maxWidth: '95vw',
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
          pt: 2.5,
          px: 3
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: 'rgba(32, 169, 231, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CardGiftcardIcon sx={{ color: '#20a9e7', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>
          {title}
        </Typography>
        <IconButton
          onClick={handleCloseReset}
          disabled={submitting}
          size="small"
          sx={{
            ml: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '50%',
            width: 32,
            height: 32
          }}
        >
          <CloseIcon sx={{ fontSize: 18, color: '#555' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 0.5 }}>
          <Box sx={{ width: 4, height: 18, bgcolor: '#20a9e7', borderRadius: '2px' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#222' }}>
            Thông tin người môi giới
          </Typography>
        </Box>

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <TextField
          autoFocus
          fullWidth
          label={
            <span>
              Tên <span style={{ color: 'red' }}>*</span>
            </span>
          }
          variant="outlined"
          size="small"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={
            <span>
              Số điện thoại <span style={{ color: 'red' }}>*</span>
            </span>
          }
          variant="outlined"
          size="small"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Nguồn"
          variant="outlined"
          size="small"
          value={data.source}
          onChange={(e) => setData({ ...data, source: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={
            <span>
              Mức hoa hồng (%) <span style={{ color: 'red' }}>*</span>
            </span>
          }
          variant="outlined"
          size="small"
          type="number"
          value={data.commissionRate}
          onChange={(e) => {
            if (isNegativeNumberValue(e.target.value)) return
            setData({ ...data, commissionRate: Number(e.target.value) })
          }}
          {...getNonNegativeNumberFieldProps(0, { max: 100 })}
          sx={{ mb: 2.5 }}
        />

        {!isEditing ? (
          <Box
            sx={{
              mb: 2.5,
              p: 1.5,
              borderRadius: '10px',
              bgcolor: '#fff4e5'
            }}
          >
            <FormControlLabel
              sx={{ alignItems: 'flex-start', m: 0 }}
              control={
                <Checkbox
                  checked={data.createAccount}
                  onChange={(e) => setData({ ...data, createAccount: e.target.checked })}
                  sx={{ p: 0, mr: 1.5 }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#20a9e7', lineHeight: 1.35 }}>
                    Tạo tài khoản môi giới
                  </Typography>
                  <Typography sx={{ color: '#1f2937', lineHeight: 1.35 }}>
                    - Mật khẩu tài khoản trùng với số điện thoại
                  </Typography>
                </Box>
              }
            />
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          gap: 1,
          justifyContent: 'flex-end'
        }}
      >
        <Button
          onClick={handleCloseReset}
          disabled={submitting}
          variant="contained"
          sx={{
            bgcolor: '#555',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '6px',
            px: 3,
            textTransform: 'none',
            '&:hover': { bgcolor: '#333' }
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          variant="contained"
          sx={{
            bgcolor: '#20a9e7',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '6px',
            px: 3,
            minWidth: 86,
            textTransform: 'none',
            '&:hover': { bgcolor: '#2b7ed7' }
          }}
        >
          {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BrokerModal
