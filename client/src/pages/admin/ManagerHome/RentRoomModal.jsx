import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Swal from 'sweetalert2'
import { getContractByIdRoom } from '~/apis/contractTemplateAPI'
import { deleteTenantById } from '~/apis/tenantAPI'
import { getTenantsByRoomId } from '~/apis/tenantAPI'
import AddTenantModal from '../NavContentAdmin/TenantManage/AddTenant'
import EditTenantModal from './EditTenantModal'

function RentRoomModal({ toggleModal, modalOpen, roomId: roomIdProp }) {
  const [contract, setContract] = useState(null)
  const [dataTenant, setDataTenant] = useState([])
  const [loading, setLoading] = useState(false)
  const [roomId, setRoomId] = useState(null)

  // Add tenant modal
  const [addOpen, setAddOpen] = useState(false)

  // Edit tenant modal
  const [editOpen, setEditOpen] = useState(false)
  const [editTenantId, setEditTenantId] = useState(null)

  const loadTenants = async (targetRoomId) => {
    try {
      const tenants = await getTenantsByRoomId(targetRoomId)
      setDataTenant(Array.isArray(tenants) ? tenants : [])
    } catch (error) {
      console.error('Error fetching tenants:', error)
      setDataTenant([])
    }
  }

  const fetchRoomData = async (id) => {
    setLoading(true)
    try {
      const response = await getContractByIdRoom(id)
      if (response) {
        setContract(response)
        setRoomId(id)
        await loadTenants(id)
      } else {
        setContract(null)
        setDataTenant([])
      }
    } catch (error) {
      console.error('Error fetching room contract:', error)
      setContract(null)
      setDataTenant([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTenant = async (tenantId) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa khách thuê này?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444'
    })
    if (!confirm.isConfirmed) return

    try {
      await deleteTenantById(tenantId)
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Xóa khách thuê thành công!' })
      loadTenants(roomId)
    } catch (error) {
      console.error('Error deleting tenant:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Xóa khách thuê không thành công!' })
    }
  }

  const handleOpenEdit = (tenantId) => {
    setEditTenantId(tenantId)
    setEditOpen(true)
  }

  const handleCloseEdit = () => {
    setEditOpen(false)
    setEditTenantId(null)
  }

  const handleEditSuccess = () => {
    loadTenants(roomId)
    // Reload contract để cập nhật tenant chính
    fetchRoomData(roomIdProp)
  }

  useEffect(() => {
    if (modalOpen && roomIdProp) {
      fetchRoomData(roomIdProp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, roomIdProp])

  const roomName = contract?.room?.name || 'Phòng'
  const mainTenant = contract?.tenant || null

  // Render 1 tenant card
  const TenantCard = ({ tenant, isMain }) => (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        p: 2,
        mb: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
          {/* API trả về fullName (PascalCase) */}
          {tenant.fullName || tenant.fullname || 'Chưa có tên'}
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#666', mb: isMain ? 1 : 0 }}>
          {tenant.phone || 'Chưa có sdt'}
        </Typography>
        {isMain && (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label="Người liên hệ"
              size="small"
              sx={{ bgcolor: '#2b7ed7', color: '#fff', fontSize: 11, fontWeight: 700 }}
            />
            <Chip
              label="đại diện hợp đồng"
              size="small"
              sx={{ bgcolor: '#2b7ed7', color: '#fff', fontSize: 11, fontWeight: 700 }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => handleDeleteTenant(tenant.tenantId)}
          sx={{
            width: 42,
            height: 42,
            bgcolor: '#ef4444',
            color: '#fff',
            '&:hover': { bgcolor: '#dc2626' }
          }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => handleOpenEdit(tenant.tenantId)}
          sx={{
            width: 42,
            height: 42,
            bgcolor: '#f3f4f6',
            color: '#333',
            border: '1px solid #e0e0e0',
            '&:hover': { bgcolor: '#e5e7eb' }
          }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <>
      <Dialog
        open={modalOpen}
        onClose={toggleModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}>
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            pb: 1.5
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: '#20a9e722',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2b7ed7'
              }}>
              <PersonIcon />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
              Danh sách khách thuê - &quot;{roomName}&quot;
            </Typography>
          </Box>
          <IconButton
            onClick={toggleModal}
            size="small"
            sx={{ border: '2px solid #fdebe5', color: '#555', '&:hover': { bgcolor: '#fff7f4' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Body */}
        <DialogContent sx={{ p: 2.5, minHeight: 120 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : !mainTenant && dataTenant.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#999', py: 3, fontSize: 14 }}>
              Chưa có thông tin khách thuê.
            </Typography>
          ) : (
            <>
              {/* Khách thuê chính từ hợp đồng */}
              {mainTenant && <TenantCard tenant={mainTenant} isMain={true} />}

              {/* Khách thuê thêm vào phòng */}
              {dataTenant
                .filter((t) => t.tenantId !== mainTenant?.tenantId)
                .map((tenant) => (
                  <TenantCard key={tenant.tenantId} tenant={tenant} isMain={false} />
                ))}
            </>
          )}
        </DialogContent>

        <Divider />

        {/* Footer */}
        <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
          <Button
            variant="contained"
            onClick={toggleModal}
            sx={{ bgcolor: '#6c757d', '&:hover': { bgcolor: '#5a6268' }, px: 2.5 }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ bgcolor: '#2b7ed7', '&:hover': { bgcolor: '#0a58ca' }, px: 2.5 }}>
            Thêm thông tin khách thuê
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal thêm khách thuê */}
      <AddTenantModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        avatar={true}
        reloadData={() => {
          loadTenants(roomId)
          fetchRoomData(roomIdProp)
        }}
      />

      {/* Modal chỉnh sửa khách thuê (mới) */}
      <EditTenantModal
        open={editOpen}
        onClose={handleCloseEdit}
        tenantId={editTenantId}
        onSuccess={handleEditSuccess}
      />
    </>
  )
}

export default RentRoomModal
