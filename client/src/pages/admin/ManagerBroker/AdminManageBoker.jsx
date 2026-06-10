/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import Swal from 'sweetalert2'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import BrokerModal from './BrokerModal'
import { useParams } from 'react-router-dom'
import { deleteBroker, getBrokers } from '~/apis/brokerAPI'

const SidebarTab = ({ label, icon, active }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1.4,
      borderRadius: '8px 8px 0 0',
      cursor: 'pointer',
      bgcolor: active ? '#20a9e7' : 'transparent',
      color: active ? '#fff' : '#555',
      fontWeight: active ? 700 : 400,
      fontSize: '14px',
      userSelect: 'none',
      transition: 'background 0.2s'
    }}
  >
    {icon}
    <span>{label}</span>
  </Box>
)

const AccountStatusBadge = ({ status }) => {
  const isLoggedIn = status === 'active' || status === 'ACTIVE'
  return (
    <Typography
      component="span"
      sx={{
        fontSize: '13px',
        fontWeight: 500,
        color: isLoggedIn ? '#20a9e7' : '#ff9800'
      }}
    >
      {isLoggedIn ? 'Đang hoạt động' : 'Chưa đăng nhập'}
    </Typography>
  )
}

const BrokerActions = ({ onEdit, onDelete }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    <Tooltip title="Chỉnh sửa">
      <IconButton
        onClick={onEdit}
        size="small"
        sx={{
          border: '1.5px solid #bbb',
          borderRadius: '8px',
          width: 36,
          height: 36,
          color: '#555',
          '&:hover': { bgcolor: '#f0f0f0', borderColor: '#888' }
        }}
      >
        <EditIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Xóa">
      <IconButton
        onClick={onDelete}
        size="small"
        sx={{
          bgcolor: '#f44336',
          borderRadius: '8px',
          width: 36,
          height: 36,
          color: '#fff',
          '&:hover': { bgcolor: '#c62828' }
        }}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  </Box>
)

const AdminManageBoker = ({ setIsAdmin, motels, setmotels }) => {
  const [open, setOpen] = useState(false)
  const [brokers, setBrokers] = useState([])
  const [editingBroker, setEditingBroker] = useState(null)
  const [loading, setLoading] = useState(false)
  const { motelId } = useParams()

  useEffect(() => {
    setIsAdmin(true)
  }, [])

  const handleClickOpen = () => {
    setEditingBroker(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingBroker(null)
  }

  const refreshBrokers = async () => {
    if (!motelId) return

    setLoading(true)
    try {
      const res = await getBrokers(motelId)
      setBrokers(res.data.result || [])
    } catch (error) {
      setBrokers([])
      Swal.fire('Lỗi', error?.response?.data?.message || 'Không thể tải danh sách môi giới.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditBroker = (broker) => {
    setEditingBroker(broker)
    setOpen(true)
  }

  const handleDeleteBroker = async (broker) => {
    if (!broker?.brokerId) {
      Swal.fire('Lỗi', 'Không tìm thấy mã môi giới để xóa.', 'error')
      return
    }

    const result = await Swal.fire({
      title: 'Xóa môi giới?',
      text: `Bạn có chắc muốn xóa ${broker.name || 'môi giới này'} khỏi danh sách?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#f44336'
    })

    if (!result.isConfirmed) return

    try {
      await deleteBroker(broker.brokerId)
      await refreshBrokers()
      Swal.fire('Thành công', 'Đã xóa môi giới.', 'success')
    } catch (error) {
      Swal.fire('Lỗi', error?.response?.data?.message || 'Không thể xóa môi giới.', 'error')
    }
  }

  useEffect(() => {
    refreshBrokers()
  }, [motelId])

  return (
    <>
      <NavAdmin setmotels={setmotels} motels={motels} />

      <Box sx={{ minHeight: '100vh', pb: 5 }}>
        <Box
          sx={{
            maxWidth: '1000px',
            mx: 'auto',
            pt: 3,
            px: 2
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '26px', color: '#1a1a1a', lineHeight: 1.2 }}>
            <Box component="span" sx={{ color: '#20a9e7', mr: 1 }}>|</Box>
            Môi giới
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#555', mt: 0.5, fontStyle: 'italic' }}>
            Các thiết lập cho người môi giới
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 2.5, px: 2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              minHeight: '300px'
            }}
          >
            <Box
              sx={{
                width: '220px',
                flexShrink: 0,
                bgcolor: '#fafafa',
                borderRight: '1px solid #e8e8e8',
                pt: 0
              }}
            >
              <SidebarTab
                label="Danh sách người môi giới"
                icon={<PersonIcon sx={{ fontSize: 18 }} />}
                active={true}
              />
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2.5
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a' }}>
                  Danh sách người môi giới
                </Typography>

                <Tooltip title="Thêm môi giới">
                  <IconButton
                    onClick={handleClickOpen}
                    sx={{
                      bgcolor: '#20a9e7',
                      color: '#fff',
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      '&:hover': { bgcolor: '#2b7ed7' },
                      boxShadow: '0 2px 8px rgba(130, 188, 229, 0.4)'
                    }}
                  >
                    <AddIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: '#333', borderBottom: '2px solid #e8e8e8', py: 1 }}>
                        Thông tin liên hệ
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: '#333', borderBottom: '2px solid #e8e8e8', py: 1 }}>
                        Nguồn
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: '#333', borderBottom: '2px solid #e8e8e8', py: 1 }}>
                        Tình trạng tài khoản sale
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: '#333', borderBottom: '2px solid #e8e8e8', py: 1 }}>
                        Phần trăm hoa hồng
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '13px', color: '#333', borderBottom: '2px solid #e8e8e8', py: 1 }}>
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={28} sx={{ color: '#20a9e7' }} />
                        </TableCell>
                      </TableRow>
                    ) : brokers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#aaa', fontSize: '14px' }}>
                          Chưa có môi giới nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      brokers.map((broker) => (
                        <TableRow
                          key={broker.brokerId || broker.phone}
                          sx={{
                            '&:hover': { bgcolor: '#f9f9f9' },
                            transition: 'background 0.15s'
                          }}
                        >
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>
                              {broker.name}
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#666', mt: 0.3 }}>
                              {broker.phone}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ py: 1.5, fontSize: '13px', color: '#444', borderBottom: '1px solid #f0f0f0' }}>
                            {broker.source || '—'}
                          </TableCell>

                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <AccountStatusBadge status={broker.accountStatus || broker.status} />
                          </TableCell>

                          <TableCell sx={{ py: 1.5, fontSize: '13px', color: '#444', borderBottom: '1px solid #f0f0f0' }}>
                            {broker.commissionRate}%
                          </TableCell>

                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <BrokerActions
                              onEdit={() => handleEditBroker(broker)}
                              onDelete={() => handleDeleteBroker(broker)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Box>
      </Box>

      <BrokerModal handleClose={handleClose} open={open} refreshBrokers={refreshBrokers} broker={editingBroker} />
    </>
  )
}

export default AdminManageBoker
