import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Swal from 'sweetalert2'
import axios from 'axios'
import { env } from '~/configs/environment'

const InvoiceModal = ({ open, onClose, room, contract, roomServices = [], deviceDetails = [] }) => {
  const [additionItems, setAdditionItems] = useState([])
  const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null

  const [invoiceData, setInvoiceData] = useState({
    invoiceCreateMonth: new Date().toISOString().slice(0, 7),
    invoiceCreateDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    dueDateofmoveinDate: '',
    invoiceReason: 'Thu tiền hàng tháng',
    note: '',
    serviceDetails: [],
    deviceDetails: []
  })

  const [loading, setLoading] = useState(false)

  // Initialize dates
  useEffect(() => {
    if (open) {
      const today = new Date()
      const formattedToday = today.toISOString().slice(0, 10)
      const dueDate = new Date(today)
      dueDate.setDate(today.getDate() + 7)
      const formattedDueDate = dueDate.toISOString().slice(0, 10)

      const moveinDate = new Date()
      const dueDateMoveIn = new Date(moveinDate)
      dueDateMoveIn.setDate(moveinDate.getDate() + 30)

      setInvoiceData((prev) => ({
        ...prev,
        invoiceCreateDate: formattedToday,
        dueDate: formattedDueDate,
        moveinDate: formattedToday,
        dueDateofmoveinDate: dueDateMoveIn.toISOString().slice(0, 10),
        contractId: contract?.contractId || null,
        price: contract?.price || room?.price || 0,
        serviceDetails: roomServices
          .filter((s) => s.isSelected)
          .map((s) => ({
            roomServiceId: s.roomServiceId,
            serviceName: s.service?.nameService,
            servicePrice: s.service?.price,
            quantity: s.quantity || 1,
            totalPrice: (s.quantity || 1) * (s.service?.price || 0)
          })),
        deviceDetails: deviceDetails
      }))
      
      setAdditionItems([])
    }
  }, [open, contract, room, roomServices, deviceDetails])

  const handleInputInvoice = (field, value) => {
    if (field === 'moveinDate') {
      const selectedDate = new Date(value)
      const dueDateMoveIn = new Date(selectedDate)
      dueDateMoveIn.setDate(selectedDate.getDate() + 30)

      setInvoiceData((prev) => ({
        ...prev,
        [field]: value,
        dueDateofmoveinDate: dueDateMoveIn.toISOString().slice(0, 10)
      }))
    } else if (field === 'invoiceCreateDate') {
      const selectedDate = new Date(value)
      const dueDate = new Date(selectedDate)
      dueDate.setDate(selectedDate.getDate() + 7)

      setInvoiceData((prev) => ({
        ...prev,
        [field]: value,
        dueDate: dueDate.toISOString().slice(0, 10)
      }))
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // Handle Additions (Cộng/Trừ tiền)
  const addNewItem = () => {
    setAdditionItems([
      ...additionItems,
      { id: Date.now(), addition: 1, additionValue: '', additionReason: '' }
    ])
  }

  const removeItem = (id) => {
    setAdditionItems(additionItems.filter((item) => item.id !== id))
  }

  const handleAdditionChange = (id, field, value) => {
    const formattedValue = field === 'additionValue' ? value.replace(/\D/g, '') : value
    setAdditionItems(additionItems.map((item) => (item.id === id ? { ...item, [field]: formattedValue } : item)))
  }

  const calculateTotalAddition = () => {
    return additionItems.reduce((total, item) => {
      const rawValue = parseFloat(item.additionValue.replace(/\./g, '')) || 0
      return total + (item.addition === 1 ? rawValue : -rawValue)
    }, 0)
  }

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    let total = parseFloat(invoiceData.price || 0)
    
    // Add services
    invoiceData.serviceDetails.forEach((s) => {
      total += parseFloat(s.totalPrice || 0)
    })
    
    // Add additions/subtractions
    total += calculateTotalAddition()
    return total
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const updatedInvoiceData = {
        ...invoiceData,
        additionItems: additionItems.map((item) => ({
          reason: item.additionReason,
          amount: parseInt(item.additionValue, 10),
          isAddition: item.addition
        }))
      }

      if (!updatedInvoiceData.contractId) {
        throw new Error('Phòng này chưa có hợp đồng để lập hóa đơn.')
      }

      await axios.post(`${env.API_URL}/api/v1/invoices/create`, updatedInvoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Hóa đơn đã được lập thành công!' })
      onClose()
    } catch (error) {
      console.error('Lỗi tạo hóa đơn:', error)
      Swal.fire({ 
        icon: 'error', 
        title: 'Thất bại', 
        text: error.message || 'Lập hóa đơn không thành công!' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptIcon />
        Lập hóa đơn - {room?.name}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, bgcolor: '#f8f9fa', p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Lý do thu"
              fullWidth
              value={invoiceData.invoiceReason}
              onChange={(e) => handleInputInvoice('invoiceReason', e.target.value)}
            >
              <MenuItem value="Thu tiền hàng tháng">Thu tiền hàng tháng</MenuItem>
              <MenuItem value="Thu tiền tháng đầu tiên">Thu tiền tháng đầu tiên</MenuItem>
              <MenuItem value="Thu tiền khi kết thúc hợp đồng">Thu tiền khi kết thúc hợp đồng</MenuItem>
              <MenuItem value="Thu tiền phòng chu kỳ">Thu tiền phòng chu kỳ</MenuItem>
              <MenuItem value="Thu tiền dịch vụ">Thu tiền dịch vụ</MenuItem>
              <MenuItem value="Thu tiền cọc">Thu tiền cọc</MenuItem>
              <MenuItem value="Hoàn tiền cọc">Hoàn tiền cọc</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="month"
              label="Tháng hóa đơn"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.invoiceCreateMonth}
              onChange={(e) => handleInputInvoice('invoiceCreateMonth', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Ngày lập hóa đơn"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.invoiceCreateDate}
              onChange={(e) => handleInputInvoice('invoiceCreateDate', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Ngày từ"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.moveinDate}
              onChange={(e) => handleInputInvoice('moveinDate', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Ngày đến"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.dueDateofmoveinDate}
              onChange={(e) => handleInputInvoice('dueDateofmoveinDate', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="date"
              label="Hạn đóng tiền"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={invoiceData.dueDate}
              onChange={(e) => handleInputInvoice('dueDate', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              rows={2}
              label="Ghi chú hóa đơn"
              fullWidth
              placeholder="Nhập ghi chú cho hóa đơn..."
              value={invoiceData.note}
              onChange={(e) => handleInputInvoice('note', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Cấu hình tiền cộng/trừ thêm */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Các khoản thu/trừ khác</Typography>
          <Button startIcon={<AddCircleIcon />} variant="outlined" size="small" onClick={addNewItem}>
            Thêm khoản
          </Button>
        </Box>

        {additionItems.map((item) => (
          <Grid container spacing={1} key={item.id} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <TextField
                select
                size="small"
                fullWidth
                value={item.addition}
                onChange={(e) => handleAdditionChange(item.id, 'addition', parseInt(e.target.value))}
              >
                <MenuItem value={1}>Cộng tiền (+)</MenuItem>
                <MenuItem value={0}>Trừ tiền (-)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                placeholder="Số tiền"
                value={item.additionValue}
                onChange={(e) => handleAdditionChange(item.id, 'additionValue', e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                fullWidth
                placeholder="Lý do"
                value={item.additionReason}
                onChange={(e) => handleAdditionChange(item.id, 'additionReason', e.target.value)}
              />
            </Grid>
            <Grid item xs={1} textAlign="right">
              <IconButton color="error" onClick={() => removeItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* Tổng quan hóa đơn */}
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, mt: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Chi tiết thành tiền</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tiền phòng:</Typography>
            <Typography variant="body2" fontWeight="bold">{Number(invoiceData.price || 0).toLocaleString('vi-VN')} đ</Typography>
          </Box>
          
          {invoiceData.serviceDetails.map((s, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Dịch vụ: {s.serviceName} (SL: {s.quantity})</Typography>
              <Typography variant="body2">{Number(s.totalPrice || 0).toLocaleString('vi-VN')} đ</Typography>
            </Box>
          ))}

          {additionItems.length > 0 && (
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: calculateTotalAddition() >= 0 ? 'success.main' : 'error.main' }}>
               <Typography variant="body2">Phát sinh khác:</Typography>
               <Typography variant="body2">{calculateTotalAddition() >= 0 ? '+' : ''}{calculateTotalAddition().toLocaleString('vi-VN')} đ</Typography>
             </Box>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="error">Tổng cộng:</Typography>
            <Typography variant="h6" color="error" fontWeight="bold">{calculateGrandTotal().toLocaleString('vi-VN')} đ</Typography>
          </Box>
        </Box>

      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy bỏ
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Lập hóa đơn'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceModal
