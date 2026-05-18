import {
  Box,
  Button,
  Checkbox,
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
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { createBroker } from '~/apis/brokerAPI'

const BrokerModal = ({ handleClose, open, refreshBrokers }) => {
  const { motelId } = useParams()
  const [data, setData] = useState({
    motelId: motelId,
    name: '',
    phone: '',
    source: '',
    commissionRate: 0,
    createAccount: false
  })

  const handleSubmit = () => {
    createBroker(data)
      .then(() => {
        refreshBrokers()
        setData({
          motelId: motelId,
          name: '',
          phone: '',
          source: '',
          commissionRate: 0,
          createAccount: false
        })
      })
      .catch((error) => {
        console.error('Error creating broker:', error)
      })
      .finally(() => {
        handleClose()
      })
  }

  const handleCloseReset = () => {
    setData({
      motelId: motelId,
      name: '',
      phone: '',
      source: '',
      commissionRate: 0,
      createAccount: false
    })
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseReset}
      sx={{
        '& .MuiDialog-paper': {
          width: '560px',
          maxWidth: '95vw',
          borderRadius: '12px'
        }
      }}
    >
      {/* Header */}
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
            bgcolor: 'rgba(76, 175, 80, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CardGiftcardIcon sx={{ color: '#20a9e7', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>
          Thêm môi giới
        </Typography>
        <IconButton
          onClick={handleCloseReset}
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
        {/* Section label */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 0.5 }}>
          <Box sx={{ width: 4, height: 18, bgcolor: '#20a9e7', borderRadius: '2px' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#222' }}>
            Thông tin người môi giới
          </Typography>
        </Box>

        {/* Tên */}
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

        {/* Số điện thoại */}
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

        {/* Nguồn */}
        <TextField
          fullWidth
          label={
            <span>
              Nguồn <span style={{ color: 'red' }}>*</span>
            </span>
          }
          variant="outlined"
          size="small"
          value={data.source}
          onChange={(e) => setData({ ...data, source: e.target.value })}
          sx={{ mb: 2 }}
        />

        {/* Mức hoa hồng */}
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
          onChange={(e) => setData({ ...data, commissionRate: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />

        {/* Tạo tài khoản môi giới */}
        <Box
          sx={{
            bgcolor: '#fff8e6',
            borderRadius: '8px',
            px: 2,
            py: 1.5,
            mb: 2.5
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={data.createAccount}
                onChange={(e) => setData({ ...data, createAccount: e.target.checked })}
                sx={{
                  color: '#bbb',
                  '&.Mui-checked': { color: '#1565c0' }
                }}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1565c0' }}>
                  Tạo tài khoản môi giới
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#555', mt: 0.25 }}>
                  - Mật khẩu tài khoản trùng với số điện thoại
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', m: 0 }}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
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
          variant="contained"
          sx={{
            bgcolor: '#20a9e7',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '6px',
            px: 3,
            textTransform: 'none',
            '&:hover': { bgcolor: '#2b7ed7' }
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BrokerModal