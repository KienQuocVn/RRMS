/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  Box,
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
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import BrokerModal from './BrokerModal'
import { useParams } from 'react-router-dom'
import { getBrokers } from '~/apis/brokerAPI'

// ── Sub-component: Sidebar tab ──────────────────────────────────────────────
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

// ── Sub-component: Status badge ─────────────────────────────────────────────
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

// ── Sub-component: Action buttons ───────────────────────────────────────────
const BrokerActions = ({ onEdit, onDelete, onRemove }) => (
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
    <Tooltip title="Loại bỏ">
      <IconButton
        onClick={onRemove}
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
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  </Box>
)

// ── Main Component ───────────────────────────────────────────────────────────
const AdminManageBoker = ({ setIsAdmin, motels, setmotels }) => {
  const [open, setOpen] = useState(false)
  const [brokers, setBrokers] = useState([])
  const { motelId } = useParams()

  useEffect(() => {
    setIsAdmin(true)
  }, [])

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const refreshBrokers = () => {
    getBrokers(motelId).then((res) => {
      setBrokers(res.data.result)
    })
  }

  useEffect(() => {
    getBrokers(motelId).then((res) => {
      setBrokers(res.data.result)
    })
  }, [motelId])

  return (
    <>
      <NavAdmin setmotels={setmotels} motels={motels} />

      <Box sx={{ minHeight: '100vh', pb: 5 }}>
        {/* Page title */}
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

        {/* Card content */}
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
            {/* Sidebar */}
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

            {/* Main panel */}
            <Box sx={{ flex: 1, p: 3 }}>
              {/* Panel header */}
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

              {/* Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#333',
                          borderBottom: '2px solid #e8e8e8',
                          py: 1
                        }}
                      >
                        Thông tin liên hệ
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#333',
                          borderBottom: '2px solid #e8e8e8',
                          py: 1
                        }}
                      >
                        Nguồn
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#333',
                          borderBottom: '2px solid #e8e8e8',
                          py: 1
                        }}
                      >
                        Tình trạng tài khoản sale
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#333',
                          borderBottom: '2px solid #e8e8e8',
                          py: 1
                        }}
                      >
                        Phần trăm hoa hồng
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#333',
                          borderBottom: '2px solid #e8e8e8',
                          py: 1
                        }}
                      >
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brokers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#aaa', fontSize: '14px' }}>
                          Chưa có môi giới nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      brokers.map((broker) => (
                        <TableRow
                          key={broker.brokerId}
                          sx={{
                            '&:hover': { bgcolor: '#f9f9f9' },
                            transition: 'background 0.15s'
                          }}
                        >
                          {/* Thông tin liên hệ: tên + SĐT */}
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>
                              {broker.name}
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#666', mt: 0.3 }}>
                              {broker.phone}
                            </Typography>
                          </TableCell>

                          {/* Nguồn */}
                          <TableCell sx={{ py: 1.5, fontSize: '13px', color: '#444', borderBottom: '1px solid #f0f0f0' }}>
                            {broker.source || '—'}
                          </TableCell>

                          {/* Tình trạng */}
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <AccountStatusBadge status={broker.accountStatus} />
                          </TableCell>

                          {/* Hoa hồng */}
                          <TableCell sx={{ py: 1.5, fontSize: '13px', color: '#444', borderBottom: '1px solid #f0f0f0' }}>
                            {broker.commissionRate}%
                          </TableCell>

                          {/* Thao tác */}
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                            <BrokerActions
                              onEdit={() => {}}
                              onDelete={() => {}}
                              onRemove={() => {}}
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

      {/* Modal */}
      <BrokerModal handleClose={handleClose} open={open} refreshBrokers={refreshBrokers} />
    </>
  )
}

export default AdminManageBoker