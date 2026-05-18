import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Box } from '@mui/material'
import Swal from 'sweetalert2'
import { getRoomById } from '~/apis/roomAPI'
import { getContractByIdRoom2, updateExtendContractStatusClose } from '~/apis/contractTemplateAPI'

function ModalExtendContract({ toggleModal, modalOpen, roomId }) {
  const [room, setRoom] = useState({})
  const [contract, setContract] = useState({})
  const [dateTerminate, setDateTerminate] = useState('')

  const fetchDataRoom = async (roomId) => {
    if (roomId) {
      try {
        const response = await getRoomById(roomId)
        if (response) {
          setRoom(response)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDateChange = (e) => {
    const selectedDateStr = e.target.value // YYYY-MM-DD
    if (!selectedDateStr) {
      setDateTerminate('')
      return
    }

    const selectedDate = new Date(selectedDateStr)
    const closeContractDate = new Date(contract.closeContract) // contract.closeContract is ISO or Date string

    // Normalize both dates to midnight for fair comparison
    selectedDate.setHours(0, 0, 0, 0)
    closeContractDate.setHours(0, 0, 0, 0)

    if (selectedDate <= closeContractDate) {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại!',
        text: 'Ngày gia hạn phải lớn hơn ngày hiện tại!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      })
      setDateTerminate('')
    } else {
      setDateTerminate(selectedDateStr)
    }
  }

  const fetchDataContract = async (roomId) => {
    if (roomId) {
      try {
        const response = await getContractByIdRoom2(roomId)
        if (response) {
          setContract(response)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    const handlFristData = () => {
      if (roomId) {
        fetchDataRoom(roomId)
        fetchDataContract(roomId)
      }
    }
    handlFristData()
  }, [roomId])

  const handleSubmit = async () => {
    if (roomId && contract && dateTerminate) {
      try {
        const selectedDate = new Date(dateTerminate)
        const closeContractDate = new Date(contract.closeContract)
        selectedDate.setHours(0, 0, 0, 0)
        closeContractDate.setHours(0, 0, 0, 0)

        if (selectedDate <= closeContractDate) {
          Swal.fire({
            icon: 'error',
            title: 'Cập nhật thất bại!',
            text: 'Ngày gia hạn phải lớn hơn ngày hiện tại!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#20a9e7'
          })
          return
        }

        await updateExtendContractStatusClose(contract.contractId, dateTerminate)

        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Trạng thái hợp đồng đã được cập nhật thành công.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        })

        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại!',
          text: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái hợp đồng.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn ngày gia hạn.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      })
    }
  }

  if (!room || !contract) return null

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          borderBottom: '1px solid #eee',
          color: '#333',
          display: 'flex',
          alignItems: 'center'
        }}>
        <Box
          sx={{
            mr: 2,
            bgcolor: '#20a9e7',
            color: 'white',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(32, 169, 231, 0.3)'
          }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </Box>
        Gia hạn hợp đồng - {room.name || 'Không có thông tin'}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ngày kết thúc hiện tại"
              type="date"
              value={formatDateForInput(contract.closeContract)}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f5f5f5' }, '& label.Mui-focused': { color: '#20a9e7' } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Gia hạn đến"
              type="date"
              value={dateTerminate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#20a9e7' }
                },
                '& label.Mui-focused': { color: '#20a9e7' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Giá thuê (đ)"
              value={contract.price ? contract.price.toLocaleString('vi-VN') : ''}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f5f5f5' }, '& label.Mui-focused': { color: '#20a9e7' } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#20a9e7',
            '&:hover': { bgcolor: '#1988bd' },
            textTransform: 'none',
            display: 'flex',
            gap: 1
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Gia hạn
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalExtendContract
