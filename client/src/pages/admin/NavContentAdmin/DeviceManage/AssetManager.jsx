import { useCallback, useEffect, useState } from 'react'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { Box, Typography, Paper, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import { deleteMotelDevice, getAllMotelDevices, insertMotelDevice, updateMotelDevice } from '~/apis/deviceAPT'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import { PRIMARY_COLOR, getUnitLabel, SWAL_ON_TOP } from './components/assetConstants.jsx'
import AssetTable from './components/AssetTable'
import AssetActionMenu from './components/AssetActionMenu'
import AssetFormModal from './components/AssetFormModal'

// ==================== MAIN COMPONENT ====================
const AssetManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [device, setDevice] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)

  // Action menu state
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRowData, setMenuRowData] = useState(null)

  const getAllMotelDevice = useCallback(async () => {
    try {
      const response = await getAllMotelDevices(motelId)
      const customdata = (response.result || []).map((item, index) => ({
        ...item,
        STT: index + 1,
        unitLabel: getUnitLabel(item.unit),
        totalNull: (item.totalQuantity || 0) - (item.totalUsing || 0),
      }))
      setDevice(customdata)
    } catch {
      setDevice([])
    }
  }, [motelId])

  const handleAddAsset = async (formData) => {
    try {
      await insertMotelDevice({ motel: { motelId }, ...formData })
      Swal.fire({ title: 'Thêm thành công', text: 'Đã thêm tài sản mới!', icon: 'success' })
      setShowModal(false)
      getAllMotelDevice()
    } catch {
      Swal.fire({ title: 'Thêm thất bại', text: 'Thử lại sau!', icon: 'error' })
    }
  }

  const handleUpdateAsset = async (formData) => {
    if (!editingDevice?.motel_device_id) return
    try {
      const response = await updateMotelDevice(editingDevice.motel_device_id, formData)
      if (response?.result) {
        Swal.fire({ title: 'Cập nhật thành công', text: 'Đã cập nhật tài sản!', icon: 'success' })
        setEditingDevice(null)
        getAllMotelDevice()
      } else {
        Swal.fire({ title: 'Cập nhật thất bại', text: response?.message || 'Thử lại sau!', icon: 'error' })
      }
    } catch {
      Swal.fire({ title: 'Cập nhật thất bại', text: 'Thử lại sau!', icon: 'error' })
    }
  }

  const handleMenuOpen = (e, row) => {
    setMenuAnchor(e.currentTarget)
    setMenuRowData(row)
  }

  const handleMenuClose = () => setMenuAnchor(null)

  const handleOpenEdit = () => {
    handleMenuClose()
    setEditingDevice(menuRowData)
  }

  const handleDelete = async () => {
    const id = menuRowData?.motel_device_id
    handleMenuClose()

    const confirm = await Swal.fire({
      title: 'Xóa tài sản?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Không',
      ...SWAL_ON_TOP,
    })
    if (!confirm.isConfirmed) return

    try {
      const response = await deleteMotelDevice(id)
      if (response.result === true) {
        Swal.fire({ title: 'Xóa thành công', text: 'Đã xóa tài sản!', icon: 'success', ...SWAL_ON_TOP })
        getAllMotelDevice()
      } else {
        Swal.fire({
          title: 'Xóa thất bại',
          text: response?.message || 'Có phòng đang sử dụng thiết bị, không thể xóa!',
          icon: 'error',
          ...SWAL_ON_TOP,
        })
      }
    } catch {
      Swal.fire({ title: 'Xóa thất bại', text: 'Có lỗi xảy ra!', icon: 'error', ...SWAL_ON_TOP })
    }
  }

  useEffect(() => {
    setIsAdmin(true)
    getAllMotelDevice()
  }, [getAllMotelDevice, setIsAdmin])

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
        <AssetTable devices={device} onMenuOpen={handleMenuOpen} />

        {/* Action Menu */}
        <AssetActionMenu
          anchorEl={menuAnchor}
          onClose={handleMenuClose}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
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
