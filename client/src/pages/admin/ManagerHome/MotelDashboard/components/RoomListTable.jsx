import { cloneElement, useState } from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
  IconButton,
  Popover,
  Avatar,
  Box,
  Grid,
  ButtonBase
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BuildIcon from '@mui/icons-material/Build'
import ArticleIcon from '@mui/icons-material/Article'
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import ReceiptIcon from '@mui/icons-material/Receipt'
import MenuIcon from '@mui/icons-material/Menu'
import HouseIcon from '@mui/icons-material/House'
import CloseIcon from '@mui/icons-material/Close'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonIcon from '@mui/icons-material/Person'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LogoutIcon from '@mui/icons-material/Logout'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Colors } from '~/theme'
import { isReserveAPlaceStatus } from '~/utils/apiAdapters'
import { formatRoomGroupLabel } from '~/utils/roomGroupUtils'

const formatCurrency = (value) => {
  if (!value) return '0 đ'
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return d.toLocaleDateString('vi-VN')
}

const formatLeaseTerm = (leaseTerm) => {
  if (!leaseTerm) return 'Chưa có'
  const termStr = String(leaseTerm).trim()
  if (termStr.toLowerCase().includes('tháng') || termStr.toLowerCase().includes('năm')) {
    return termStr
  }
  return `${termStr} tháng`
}

// Status Chips
const getStatusChip = (room) => {
  const status = room.latestContract?.status
  const reserveStatus = room.reserveAPlace?.status

  if (status === 'ACTIVE')
    return (
      <Chip
        label="Đang ở"
        sx={{ bgcolor: Colors.success, color: 'white', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  if (status === 'IATExpire')
    return (
      <Chip
        label="Sắp kết thúc HĐ"
        sx={{ bgcolor: '#ff9800', color: 'white', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  if (status === 'ReportEnd')
    return (
      <Chip
        label="Đang báo KT"
        sx={{ bgcolor: '#ff9800', color: 'white', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  if (status === 'ENDED')
    return (
      <Chip
        label="Đã quá hạn hợp đồng"
        sx={{ bgcolor: '#d32f2f', color: 'white', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  if (isReserveAPlaceStatus(reserveStatus))
    return (
      <Chip
        label="Đang cọc giữ chỗ"
        sx={{ bgcolor: '#ff9800', color: 'white', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
      />
    )
  return (
    <Chip
      label="Đang trống"
      sx={{ bgcolor: '#e0e0e0', color: '#757575', height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
    />
  )
}

// Action Item component for 2-column grid
const ActionItem = ({ icon, label, color, onClick }) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      width: '100%',
      px: 2,
      py: 1.5,
      justifyContent: 'flex-start',
      borderRadius: 1,
      '&:hover': { bgcolor: '#f5f5f5' }
    }}>
    {cloneElement(icon, { sx: { fontSize: 20, color: color || '#555' } })}
    <Typography variant="body2" sx={{ fontWeight: 600, color: color || '#333', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
  </ButtonBase>
)

const RoomListTable = ({ rooms, columns = [], onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const open = Boolean(anchorEl)

  const handleOpenMenu = (event, room) => {
    setAnchorEl(event.currentTarget)
    setSelectedRoom(room)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRoom(null)
  }

  const handleAction = (action) => {
    if (action === 'close') {
      handleCloseMenu()
      return
    }
    if (selectedRoom && onActionClick) {
      onActionClick(action, selectedRoom)
    }
    handleCloseMenu()
  }

  const isVisible = (colId) => {
    const col = columns.find((c) => c.id === colId)
    return col ? col.visible : true
  }

  const getMenuItems = () => {
    if (!selectedRoom) return []
    const contractStatus = selectedRoom.latestContract?.status
    const reserveStatus = selectedRoom.reserveAPlace?.status

    const activeContractItems = [
      { icon: <ReceiptIcon />, label: 'Lập hóa đơn', action: 'invoice' },
      { icon: <InfoIcon />, label: 'Chi tiết phòng', action: 'detail' },
      { icon: <PersonIcon />, label: 'Danh sách khách thuê', action: 'list_tenant' },
      { icon: <AttachMoneyIcon />, label: 'Thu tiền', action: 'collect' },
      { icon: <NotificationsNoneIcon />, label: 'Báo kết thúc hợp đồng phòng', action: 'report_end' },
      { icon: <SwapHorizIcon />, label: 'Chuyển đổi phòng', action: 'change_room' },
      { icon: <LogoutIcon />, label: 'Kết thúc hợp đồng phòng', action: 'end_contract' },
      { icon: <ReceiptIcon />, label: 'Cài đặt dịch vụ', action: 'services' },
      { icon: <InfoIcon />, label: 'Xem văn bản hợp đồng', action: 'view_contract' },
      { icon: <BuildIcon />, label: 'Thiết lập tài sản', action: 'devices' },
      { icon: <PrintIcon />, label: 'In văn bản hợp đồng', action: 'print_contract' },
      { icon: <ShareIcon />, label: 'Chia sẻ văn bản hợp đồng', action: 'share_contract' },
      { icon: <EditIcon />, label: 'Ghi chú', action: 'edit', color: '#2e7d32' },
      { icon: <ShareIcon />, label: 'Chia sẻ mã kết nối', action: 'share_code' },
      { icon: <DirectionsCarIcon />, label: 'Quản lý xe', action: 'list_car' },
      { icon: <CloseIcon />, label: 'Đóng menu', action: 'close' }
    ]

    if (contractStatus === 'ACTIVE') return activeContractItems

    if (contractStatus === 'IATExpire') {
      return [
        ...activeContractItems.slice(0, 7),
        { icon: <ArticleIcon />, label: 'Gia hạn hợp đồng', action: 'extend_contract', color: '#2e7d32' },
        ...activeContractItems.slice(7)
      ]
    }

    if (contractStatus === 'ReportEnd') {
      return activeContractItems.map((item) =>
        item.action === 'report_end'
          ? {
              icon: <DeleteIcon />,
              label: 'Hủy báo kết thúc hợp đồng phòng',
              action: 'cancel_report',
              color: '#d32f2f'
            }
          : item
      )
    }

    if (!contractStatus && isReserveAPlaceStatus(reserveStatus)) {
      return [
        { icon: <ArticleIcon />, label: 'Hợp đồng mới', action: 'rent', color: '#2e7d32' },
        { icon: <ArrowForwardIcon />, label: 'Chi tiết phòng', action: 'detail', color: '#1565c0' },
        { icon: <VisibilityIcon />, label: 'Xem cọc giữ chỗ', action: 'view_reserve' },
        { icon: <CloseIcon />, label: 'Hủy cọc giữ chỗ', action: 'cancel_reserve', color: '#d32f2f' },
        { icon: <ReceiptIcon />, label: 'Cài đặt dịch vụ', action: 'services' },
        { icon: <DeleteIcon />, label: 'Xóa phòng', action: 'delete', color: '#d32f2f' },
        { icon: <BuildIcon />, label: 'Thiết lập tài sản', action: 'devices' },
        { icon: <CloseIcon />, label: 'Đóng menu', action: 'close' }
      ]
    }

    return [
      { icon: <ArticleIcon />, label: 'Hợp đồng mới', action: 'rent', color: '#2e7d32' },
      { icon: <InfoIcon />, label: 'Chi tiết phòng', action: 'detail', color: '#1565c0' },
      { icon: <MoneyOffIcon />, label: 'Cọc giữ chỗ', action: 'deposit' },
      { icon: <DeleteIcon />, label: 'Xóa phòng', action: 'delete', color: '#d32f2f' },
      { icon: <ReceiptIcon />, label: 'Cài đặt dịch vụ', action: 'services' },
      { icon: <CloseIcon />, label: 'Đóng menu', action: 'close' },
      { icon: <BuildIcon />, label: 'Thiết lập tài sản', action: 'devices' }
    ]
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 380px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#fff' }}></TableCell>
              {isVisible('name') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Tên phòng</TableCell>
              )}
              {isVisible('group') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Tầng</TableCell>
              )}
              {isVisible('price') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Giá thuê</TableCell>
              )}
              {isVisible('deposit') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Tiền cọc</TableCell>
              )}
              {isVisible('debt') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Tiền nợ</TableCell>
              )}
              {isVisible('priority') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ưu tiên</TableCell>
              )}
              {isVisible('invoiceDate') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>
                  Ngày lập hóa đơn
                </TableCell>
              )}
              {isVisible('paymentCircle') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Chu kỳ thu tiền</TableCell>
              )}
              {isVisible('moveinDate') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ngày vào ở</TableCell>
              )}
              {isVisible('duration') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>
                  Thời hạn hợp đồng
                </TableCell>
              )}
              {isVisible('status') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', textAlign: 'center' }}>
                  Tình trạng
                </TableCell>
              )}
              {isVisible('finance') && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', textAlign: 'center' }}>
                  Tài chính
                </TableCell>
              )}
              <TableCell sx={{ bgcolor: '#fff' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy phòng nào phù hợp.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room, index) => (
                <TableRow hover key={room.roomId} sx={{ bgcolor: index % 2 === 0 ? '#fff5f2' : '#ffffff' }}>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MenuIcon sx={{ color: 'action.active', fontSize: 20 }} />
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor:
                            room.latestContract?.status === 'ACTIVE'
                              ? Colors.success
                              : isReserveAPlaceStatus(room.reserveAPlace?.status)
                                ? '#ff9800'
                                : '#bdbdbd'
                        }}>
                        <HouseIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </Box>
                  </TableCell>
                  {/* Tên phòng */}
                  {isVisible('name') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {room.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}

                  {/* Nhóm */}
                  {isVisible('group') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatRoomGroupLabel(room.group) || 'Chưa phân nhóm'}
                      </Typography>
                    </TableCell>
                  )}

                  {/* Giá thuê */}
                  {isVisible('price') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                        {formatCurrency(room.price)}
                      </Typography>
                      {/* Giả lập chưa thu lần nào nếu ko có thông tin thanh toán */}
                      <Typography variant="caption" color="error" sx={{ fontSize: '0.65rem' }}>
                        {room.invoices?.length > 0 ? 'Đã thu' : 'Chưa thu lần nào'}
                      </Typography>
                    </TableCell>
                  )}

                  {/* Tiền cọc */}
                  {isVisible('deposit') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                        {formatCurrency(room.deposit || room.price)}
                      </Typography>
                      {(!room.deposit || room.deposit === 0) && (
                        <Typography variant="caption" color="error" sx={{ fontSize: '0.65rem' }}>
                          (Chưa thu tiền cọc)
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  {/* Tiền nợ */}
                  {isVisible('debt') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography
                        variant="caption"
                        color={room.debt > 0 ? 'error' : 'text.primary'}
                        fontWeight={room.debt > 0 ? 'bold' : 'normal'}>
                        {formatCurrency(room.debt || 0)}
                      </Typography>
                    </TableCell>
                  )}

                  {/* Ưu tiên */}
                  {isVisible('priority') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Chip
                        label={room.prioritize || 'Tất cả'}
                        sx={{ bgcolor: '#ffb300', color: 'white', height: 18, fontSize: '0.6rem', fontWeight: 'bold' }}
                      />
                    </TableCell>
                  )}

                  {/* Ngày lập hóa đơn */}
                  {isVisible('invoiceDate') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption">Ngày {room.invoiceDate || 1}</Typography>
                    </TableCell>
                  )}

                  {/* Chu kỳ thu tiền */}
                  {isVisible('paymentCircle') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption">{room.paymentCircle || 1} tháng</Typography>
                    </TableCell>
                  )}

                  {/* Ngày vào ở */}
                  {isVisible('moveinDate') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption">{formatDate(room.latestContract?.moveinDate) || ''}</Typography>
                    </TableCell>
                  )}

                  {/* Thời hạn hợp đồng */}
                  {isVisible('duration') && (
                    <TableCell sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Typography variant="caption" color={room.latestContract ? 'text.primary' : 'text.secondary'}>
                        {formatLeaseTerm(room.latestContract?.leaseTerm)}
                      </Typography>
                    </TableCell>
                  )}

                  {/* Tình trạng */}
                  {isVisible('status') && (
                    <TableCell align="center" sx={{ borderRight: '1px solid #eeeeee' }}>
                      {getStatusChip(room)}
                    </TableCell>
                  )}

                  {/* Tài chính */}
                  {isVisible('finance') && (
                    <TableCell align="center" sx={{ borderRight: '1px solid #eeeeee' }}>
                      <Chip
                        label={room.finance === 'wait' || !room.debt ? 'Chờ kỳ thu mới' : 'Nợ tiền'}
                        sx={{
                          bgcolor: room.debt > 0 ? '#ffcdd2' : '#20a9e722',
                          color: room.debt > 0 ? '#c62828' : '#2e7d32',
                          height: 18,
                          fontSize: '0.6rem',
                          border: `1px solid ${room.debt > 0 ? '#ef9a9a' : '#a5d6a7'}`
                        }}
                      />
                    </TableCell>
                  )}

                  {/* Thao tác */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, room)}
                      sx={{ border: '1px solid #e0e0e0', p: 0.5 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 2-Column Action Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 480,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 1
          }
        }}>
        <Grid container>
          {getMenuItems().map((item, index) => (
            <Grid item xs={6} key={index}>
              <ActionItem
                icon={item.icon}
                label={item.label}
                color={item.color}
                onClick={() => handleAction(item.action)}
              />
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Paper>
  )
}

export default RoomListTable
