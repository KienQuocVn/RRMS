import { useEffect, useState } from 'react'
import {
  Box, Typography, Dialog, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton
} from '@mui/material'
import CardGiftcardOutlined from '@mui/icons-material/CardGiftcardOutlined'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'
import { getNonNegativeNumberFieldProps, wrapNonNegativeNumberChange } from '~/utils/numberInputUtils'
import { PRIMARY_COLOR, ASSET_ICONS, SWAL_ON_TOP } from './assetConstants.jsx'

// ==================== ASSET FORM MODAL ====================
const AssetFormModal = ({ open, onClose, onSubmit, initialData = null, mode = 'add' }) => {
  const isEditMode = mode === 'edit'
  const [deviceName, setDeviceName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('')
  const [value, setValue] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('cai')
  const [supplier, setSupplier] = useState('')

  useEffect(() => {
    if (!open) return

    if (isEditMode && initialData) {
      setDeviceName(initialData.deviceName || '')
      setSelectedIcon(initialData.icon || '')
      setValue(initialData.value ?? '')
      setValueInput(initialData.valueInput ?? '')
      setQuantity(initialData.totalQuantity ?? '')
      setUnit((initialData.unit || 'cai').toLowerCase())
      setSupplier(initialData.supplier || '')
      return
    }

    setDeviceName('')
    setSelectedIcon('')
    setValue('')
    setValueInput('')
    setQuantity('')
    setUnit('cai')
    setSupplier('')
  }, [open, isEditMode, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!deviceName || !value || !quantity || !selectedIcon) {
      Swal.fire({
        title: 'Vui lòng điền đủ thông tin bắt buộc (*)',
        icon: 'error',
        ...SWAL_ON_TOP,
      })
      return
    }

    if (isEditMode && Number(quantity) < Number(initialData?.totalUsing || 0)) {
      Swal.fire({
        title: 'Không thể cập nhật',
        text: `Tổng số lượng không được nhỏ hơn số lượng đang sử dụng (${initialData?.totalUsing || 0}).`,
        icon: 'error',
        ...SWAL_ON_TOP,
      })
      return
    }

    onSubmit({
      deviceName,
      icon: selectedIcon,
      value,
      valueInput,
      totalQuantity: quantity,
      unit,
      supplier
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', overflow: 'hidden' }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CardGiftcardOutlined sx={{ color: PRIMARY_COLOR, fontSize: '1.4rem' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.1rem' }}>
            {isEditMode ? 'Chỉnh sửa tài sản' : 'Thêm mới tài sản'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#999' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        {/* Tên tài sản */}
        <TextField
          fullWidth
          label="Tên tài sản"
          required
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mb: 2.5 }}
        />

        {/* Chọn icon */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ borderLeft: `3px solid ${PRIMARY_COLOR}`, pl: 1.5, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem' }}>
              Chọn icon đại diện cho tài sản
            </Typography>
          </Box>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            p: 1.5,
          }}>
            {ASSET_ICONS.map(({ id, Icon, label }) => (
              <Box
                key={id}
                onClick={() => setSelectedIcon(id)}
                title={label}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  p: 1.2, borderRadius: '8px', cursor: 'pointer',
                  border: selectedIcon === id ? `2px solid ${PRIMARY_COLOR}` : '1px solid #e8e8e8',
                  backgroundColor: selectedIcon === id ? '#e3f2fd' : 'transparent',
                  transition: 'all 0.15s',
                  '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#bbb' },
                }}
              >
                <Icon sx={{ fontSize: 28, color: selectedIcon === id ? PRIMARY_COLOR : '#666' }} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Giá trị tài sản + Giá trị nhập vào */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Giá trị tài sản (đ)"
            required
            type="number"
            value={value}
            onChange={wrapNonNegativeNumberChange((e) => setValue(e.target.value))}
            variant="outlined"
            size="small"
            {...getNonNegativeNumberFieldProps()}
          />
          <TextField
            fullWidth
            label="Giá trị nhập vào (đ)"
            type="number"
            value={valueInput}
            onChange={wrapNonNegativeNumberChange((e) => setValueInput(e.target.value))}
            variant="outlined"
            size="small"
            {...getNonNegativeNumberFieldProps()}
          />
        </Box>

        {/* Tổng số lượng + Đơn vị */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Tổng số lượng"
            required
            type="number"
            value={quantity}
            onChange={wrapNonNegativeNumberChange((e) => setQuantity(e.target.value))}
            variant="outlined"
            size="small"
            {...getNonNegativeNumberFieldProps()}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Đơn vị (chiếc/cái)</InputLabel>
            <Select
              value={unit}
              label="Đơn vị (chiếc/cái)"
              onChange={(e) => setUnit(e.target.value)}
            >
              <MenuItem value="cai">Cái</MenuItem>
              <MenuItem value="chiec">Chiếc</MenuItem>
              <MenuItem value="bo">Bộ</MenuItem>
              <MenuItem value="cap">Cặp</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Đơn vị cung cấp */}
        <TextField
          fullWidth
          label="Đơn vị cung cấp"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          variant="outlined"
          size="small"
          multiline
          minRows={1}
        />
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#666', borderColor: '#ccc', textTransform: 'none', fontWeight: 600,
            borderRadius: '8px', px: 3,
            '&:hover': { borderColor: '#999', backgroundColor: '#f5f5f5' }
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: PRIMARY_COLOR, textTransform: 'none', fontWeight: 600,
            borderRadius: '8px', px: 3,
            '&:hover': { backgroundColor: '#2b7ed7' }
          }}
        >
          {isEditMode ? 'Lưu thay đổi' : 'Thêm tài sản'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssetFormModal
