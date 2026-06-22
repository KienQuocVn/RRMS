import { useEffect, useState } from 'react'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Menu, MenuItem,
  Dialog, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CardGiftcardOutlined from '@mui/icons-material/CardGiftcardOutlined'
import CloseIcon from '@mui/icons-material/Close'
// MUI Icons for asset icon picker
import SingleBedOutlined from '@mui/icons-material/SingleBedOutlined'
import LocalLaundryServiceOutlined from '@mui/icons-material/LocalLaundryServiceOutlined'
import TableBarOutlined from '@mui/icons-material/TableBarOutlined'
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined'
import NightlightOutlined from '@mui/icons-material/NightlightOutlined'
import AcUnitOutlined from '@mui/icons-material/AcUnitOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import WeekendOutlined from '@mui/icons-material/WeekendOutlined'
import DoorSlidingOutlined from '@mui/icons-material/DoorSlidingOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import KitchenOutlined from '@mui/icons-material/KitchenOutlined'
import TvOutlined from '@mui/icons-material/TvOutlined'
import ChairOutlined from '@mui/icons-material/ChairOutlined'
import ShowerOutlined from '@mui/icons-material/ShowerOutlined'
import MicrowaveOutlined from '@mui/icons-material/MicrowaveOutlined'

import { deleteMotelDevice, getAllMotelDevices, insertMotelDevice, updateMotelDevice } from '~/apis/deviceAPT'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const PRIMARY_COLOR = '#20a9e7'


// Icon registry - maps backend icon IDs to MUI icon components
const ASSET_ICONS = [
  { id: 'ban', label: 'Bàn', Icon: TableBarOutlined },
  { id: 'banan', label: 'Ghế', Icon: ChairOutlined },
  { id: 'bed', label: 'Giường', Icon: SingleBedOutlined },
  { id: 'chiakhoa', label: 'Chìa khóa', Icon: VpnKeyOutlined },
  { id: 'denngu', label: 'Đèn ngủ', Icon: NightlightOutlined },
  { id: 'maygiat', label: 'Máy giặt', Icon: LocalLaundryServiceOutlined },
  { id: 'maylanh', label: 'Máy lạnh', Icon: AcUnitOutlined },
  { id: 'okhoa', label: 'Ổ khóa', Icon: LockOutlined },
  { id: 'sofa', label: 'Sofa', Icon: WeekendOutlined },
  { id: 'tuao', label: 'Tủ áo', Icon: DoorSlidingOutlined },
  { id: 'tusach', label: 'Tủ sách', Icon: MenuBookOutlined },
  { id: 'tivi', label: 'Tivi', Icon: TvOutlined },
  { id: 'bep', label: 'Bếp', Icon: KitchenOutlined },
  { id: 'voisem', label: 'Vòi sen', Icon: ShowerOutlined },
  { id: 'lovisong', label: 'Lò vi sóng', Icon: MicrowaveOutlined },
]

// Lookup map for quick icon access
const ICON_MAP = ASSET_ICONS.reduce((map, item) => {
  map[item.id] = item
  return map
}, {})

// Render icon by ID
const renderAssetIcon = (iconId, size = 28) => {
  const found = ICON_MAP[iconId]
  if (found) {
    const { Icon } = found
    return <Icon sx={{ fontSize: size, color: '#555' }} />
  }
  return <CardGiftcardOutlined sx={{ fontSize: size, color: '#555' }} />
}

// Format currency VND
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 đ'
  return `${Number(value).toLocaleString('vi-VN')} đ`
}

// Unit label mapping
const getUnitLabel = (unit) => {
  const map = { CAI: 'Cái', cai: 'Cái', CHIEC: 'Chiếc', chiec: 'Chiếc', BO: 'Bộ', bo: 'Bộ', CAP: 'Cặp', cap: 'Cặp' }
  return map[unit] || unit || 'Cái'
}

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

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!deviceName || !value || !quantity || !selectedIcon) {
      Swal.fire('Vui lòng điền đủ thông tin bắt buộc (*)', '', 'error')
      return
    }

    if (isEditMode && Number(quantity) < Number(initialData?.totalUsing || 0)) {
      Swal.fire(
        'Không thể cập nhật',
        `Tổng số lượng không được nhỏ hơn số lượng đang sử dụng (${initialData?.totalUsing || 0}).`,
        'error'
      )
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
      onClose={handleClose}
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
        <IconButton onClick={handleClose} size="small" sx={{ color: '#999' }}>
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
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            size="small"

          />
          <TextField
            fullWidth
            label="Giá trị nhập vào (đ)"
            type="number"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            variant="outlined"
            size="small"

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
            onChange={(e) => setQuantity(e.target.value)}
            variant="outlined"
            size="small"

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
          onClick={handleClose}
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

// ==================== MAIN COMPONENT ====================
const AssetManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [device, setDevice] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  // Action menu state
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRowId, setMenuRowId] = useState(null)
  const [menuRowData, setMenuRowData] = useState(null)

  const getAllMotelDevice = async () => {
    try {
      const response = await getAllMotelDevices(motelId)
      const customdata = (response.result || []).map((item, index) => ({
        ...item,
        STT: index + 1,
        unitLabel: getUnitLabel(item.unit),
        totalNull: (item.totalQuantity || 0) - (item.totalUsing || 0),
      }))
      setDevice(customdata)
    } catch (error) {
      console.error('Error fetching devices:', error)
      setDevice([])
    }
  }

  const handleAddAsset = async (formData) => {
    try {
      await insertMotelDevice({
        motel: { motelId },
        ...formData
      })
      Swal.fire('Thêm thành công', 'Đã thêm tài sản mới!', 'success')
      setShowModal(false)
      getAllMotelDevice()
    } catch (error) {
      console.error('Error adding device:', error)
      Swal.fire('Thêm thất bại', 'Thử lại sau!', 'error')
    }
  }

  const handleUpdateAsset = async (formData) => {
    if (!editingDevice?.motel_device_id) return

    try {
      const response = await updateMotelDevice(editingDevice.motel_device_id, formData)
      if (response?.result) {
        Swal.fire('Cập nhật thành công', 'Đã cập nhật tài sản!', 'success')
        setEditingDevice(null)
        getAllMotelDevice()
      } else {
        Swal.fire('Cập nhật thất bại', response?.message || 'Thử lại sau!', 'error')
      }
    } catch (error) {
      console.error('Error updating device:', error)
      Swal.fire('Cập nhật thất bại', 'Thử lại sau!', 'error')
    }
  }

  const handleOpenEdit = () => {
    setMenuAnchor(null)
    setEditingDevice(menuRowData)
  }

  const handleDelete = async (id) => {
    setMenuAnchor(null)
    const confirm = await Swal.fire({
      title: 'Xóa tài sản?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Không'
    })
    if (!confirm.isConfirmed) return

    try {
      const response = await deleteMotelDevice(id)
      if (response.result === true) {
        Swal.fire('Xóa thành công', 'Đã xóa tài sản!', 'success')
        getAllMotelDevice()
      } else {
        Swal.fire('Xóa thất bại', response?.message || 'Có phòng đang sử dụng thiết bị, không thể xóa!', 'error')
      }
    } catch (error) {
      Swal.fire('Xóa thất bại', 'Có lỗi xảy ra!', 'error')
    }
  }

  useEffect(() => {
    setIsAdmin(true)
    getAllMotelDevice()
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      <Paper
        elevation={0}
        sx={{
          mx: '10px', mb: '10px', borderRadius: '12px',
          border: '1px solid #e8f4fd', overflow: 'hidden',
          backgroundColor: '#fff', p: 2.5,
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ borderLeft: `4px solid ${PRIMARY_COLOR}`, pl: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
              Tất cả tài sản
            </Typography>
            <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
              Danh sách tài sản đang có
            </Typography>
          </Box>
          <IconButton
            onClick={() => setShowModal(true)}
            sx={{
              backgroundColor: PRIMARY_COLOR, color: '#fff',
              width: 40, height: 40,
              '&:hover': { backgroundColor: '#2b7ed7' },
              boxShadow: '0 3px 8px rgba(67,160,71,0.3)',
            }}
          >
            <AddIcon sx={{ fontSize: '1.4rem' }} />
          </IconButton>
        </Box>

        {/* Filter row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.5,
            border: '1px solid #e0e0e0', borderRadius: '8px', px: 1.5, py: 0.5,
          }}>
            <FilterListIcon sx={{ color: '#555', fontSize: '1.2rem' }} />
            <Box sx={{
              backgroundColor: PRIMARY_COLOR, color: '#fff', borderRadius: '50%',
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700
            }}>
              {device.length}
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['', 'Tên tài sản', 'Giá trị nhập vào', 'Giá trị tài sản', 'Tổng số lượng',
                    'Tổng số đang sử dụng', 'Tổng số còn dư', 'Đơn vị', 'Tình trạng', ''].map((header, i) => (
                    <TableCell
                      key={i}
                      align="center"
                      sx={{
                        backgroundColor: '#f8f9fa', fontWeight: 700, color: '#333',
                        fontSize: '0.82rem', borderBottom: '2px solid #e0e0e0',
                        whiteSpace: 'nowrap', py: 1.5,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {device.length > 0 ? (
                  device.map((row, idx) => (
                    <TableRow
                      key={row.motel_device_id || idx}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
                        '&:hover': { backgroundColor: '#f0f7ff' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {/* Icon */}
                      <TableCell align="center" sx={{ py: 1.2 }}>
                        <Box sx={{
                          width: 38, height: 38, borderRadius: '50%', mx: 'auto',
                          backgroundColor: '#e8f5e9', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          {renderAssetIcon(row.icon, 22)}
                        </Box>
                      </TableCell>
                      {/* Tên */}
                      <TableCell sx={{ fontWeight: 600, color: '#333', fontSize: '0.85rem' }}>
                        {row.deviceName}
                      </TableCell>
                      {/* Giá trị nhập vào */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem', color: '#555' }}>
                        {formatCurrency(row.valueInput)}
                      </TableCell>
                      {/* Giá trị tài sản */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 600, color: PRIMARY_COLOR }}>
                        {formatCurrency(row.value)}
                      </TableCell>
                      {/* Tổng số lượng */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{row.totalQuantity || 0}</TableCell>
                      {/* Đang sử dụng */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{row.totalUsing || 0}</TableCell>
                      {/* Còn dư */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{row.totalNull || 0}</TableCell>
                      {/* Đơn vị */}
                      <TableCell align="center" sx={{ fontSize: '0.85rem' }}>{row.unitLabel}</TableCell>
                      {/* Tình trạng */}
                      <TableCell align="center">
                        <Chip
                          label={row.totalNull > 0 ? 'Đang hoạt động' : 'Hết hàng'}
                          size="small"
                          sx={{
                            backgroundColor: row.totalNull > 0 ? '#e8f5e9' : '#ffebee',
                            color: row.totalNull > 0 ? PRIMARY_COLOR : '#e53935',
                            fontWeight: 600, fontSize: '0.75rem', borderRadius: '6px',
                          }}
                        />
                      </TableCell>
                      {/* Actions */}
                      <TableCell align="center" sx={{ py: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setMenuAnchor(e.currentTarget)
                            setMenuRowId(row.motel_device_id)
                            setMenuRowData(row)
                          }}
                          sx={{ color: '#999', '&:hover': { color: '#555' } }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                        Không tìm thấy dữ liệu!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: { borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 160 }
          }}
        >
          <MenuItem
            onClick={handleOpenEdit}
            sx={{ fontSize: '0.85rem', gap: 1 }}
          >
            <EditOutlinedIcon fontSize="small" />
            Chỉnh sửa tài sản
          </MenuItem>
          <MenuItem
            onClick={() => handleDelete(menuRowId)}
            sx={{ color: '#e53935', fontSize: '0.85rem', gap: 1 }}
          >
            <DeleteOutlineIcon fontSize="small" />
            Xóa tài sản
          </MenuItem>
        </Menu>
      </Paper>

      {/* Add Asset Modal */}
      <AssetFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAsset}
        mode="add"
      />

      {/* Edit Asset Modal */}
      <AssetFormModal
        open={Boolean(editingDevice)}
        onClose={() => setEditingDevice(null)}
        onSubmit={handleUpdateAsset}
        initialData={editingDevice}
        mode="edit"
      />
    </Box>
  )
}

export default AssetManager
