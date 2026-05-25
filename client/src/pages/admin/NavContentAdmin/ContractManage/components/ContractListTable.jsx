import { useState } from 'react'
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { Colors } from '~/theme'

const COLLECTION_CYCLE_LABELS = {
  0: 'Tuy chinh',
  1: '1 thang',
  2: '2 thang',
  3: '3 thang',
  4: '4 thang',
  5: '5 thang',
  6: '6 thang',
  7: '7 thang',
  8: '8 thang',
  9: '9 thang',
  10: '10 thang',
  11: '11 thang',
  12: '1 nam',
  18: '1 nam 6 thang',
  24: '2 nam',
  32: '3 nam',
  48: '4 nam',
  60: '5 nam'
}

const formatCurrency = (value, fallback = '0 d') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback
  }

  return `${Number(value).toLocaleString('vi-VN')} d`
}

const formatDate = (value) => {
  if (!value) return 'Chua cap nhat'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Chua cap nhat'
  }

  return date.toLocaleDateString('vi-VN')
}

const getStatusChip = (status) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <Chip
          label="Trong thời hạn hợp đồng"
          size="small"
          sx={{ bgcolor: Colors.info, color: '#fff', fontWeight: 700 }}
        />
      )
    case 'ReportEnd':
      return (
        <Chip label="Đang báo kết thúc" size="small" sx={{ bgcolor: Colors.warning, color: '#fff', fontWeight: 700 }} />
      )
    case 'IATExpire':
      return <Chip label="Sắp đến hạn" size="small" sx={{ bgcolor: Colors.error, color: '#fff', fontWeight: 700 }} />
    case 'Stake':
      return <Chip label="Đang cọc" size="small" sx={{ bgcolor: Colors.info, color: '#fff', fontWeight: 700 }} />
    case 'ENDED':
      return <Chip label="Đã quá hạn" size="small" sx={{ bgcolor: Colors.grey, color: '#fff', fontWeight: 700 }} />
    default:
      return <Chip label={status || 'Không xác định'} size="small" variant="outlined" />
  }
}

const getSignatureChip = (signContract) => {
  const normalizedValue = String(signContract || '')
    .trim()
    .toLowerCase()
  const isSigned = normalizedValue.includes('da ky')

  return (
    <Chip
      label={signContract || 'Chua ky'}
      size="small"
      sx={{
        bgcolor: isSigned ? '#e8f5e9' : '#f5f5f5',
        color: isSigned ? '#2e7d32' : '#616161',
        border: `1px solid ${isSigned ? '#a5d6a7' : '#e0e0e0'}`,
        fontWeight: 700
      }}
    />
  )
}

const ActionItem = ({ icon, label, onClick, ...rest }) => (
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
    }}
    {...rest}>
    {icon}
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
  </ButtonBase>
)

const ContractListTable = ({ contracts, onActionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)

  const actionItems = [
    {
      action: 'view',
      label: 'Xem văn bản hợp đồng',
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 20, color: '#1565c0' }} />
    },
    {
      action: 'assets',
      label: 'Thiết lập tài sản',
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 20, color: '#6d4c41' }} />,
      modalProps: { 'data-bs-toggle': 'modal', 'data-bs-target': '#assetSelect' }
    },
    {
      action: 'print',
      label: 'In văn bản hợp đồng',
      icon: <PrintOutlinedIcon sx={{ fontSize: 20, color: '#2e7d32' }} />
    },
    {
      action: 'share',
      label: 'Chia sẻ văn bản hợp đồng',
      icon: <ShareOutlinedIcon sx={{ fontSize: 20, color: '#7b1fa2' }} />
    },
    {
      action: 'shareCode',
      label: 'Chia sẻ mã kết nối',
      icon: <LinkOutlinedIcon sx={{ fontSize: 20, color: '#ef6c00' }} />
    }
  ]

  const handleOpenMenu = (event, contract) => {
    setAnchorEl(event.currentTarget)
    setSelectedContract(contract)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedContract(null)
  }

  const resolveTenantName = (contract) => {
    return contract.tenant?.fullName || contract.tenant?.fullname || 'Khach chua ky'
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 330px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>
                Phòng & người đại diện
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Giá thuê</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Mức tiền cọc</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Chu kỳ thu</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Mẫu hợp đồng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ngày lập</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ngày vào ở</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Thời hạn hợp đồng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Hình ảnh chứng từ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ký hợp đồng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff' }}>Ngôn ngữ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#fff', textAlign: 'center' }}>
                Tình trạng
              </TableCell>
              <TableCell sx={{ bgcolor: '#fff', width: 64 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Khong tim thay hop dong phu hop.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract, index) => (
                <TableRow hover key={contract.contractId} sx={{ bgcolor: index % 2 === 0 ? '#fff5f2' : '#ffffff' }}>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 260 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: Colors.info }}>
                          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            minWidth: 18,
                            height: 18,
                            borderRadius: '999px',
                            bgcolor: Colors.warning,
                            color: '#fff',
                            px: 0.5,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #fff'
                          }}>
                          {contract.countTenant || 0}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {contract.room?.name || 'Khong xac dinh'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <PersonOutlineIcon sx={{ fontSize: 14, color: '#757575' }} />
                          <Typography variant="caption" color="text.secondary">
                            {resolveTenantName(contract)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 130 }}>
                    <Typography variant="caption" fontWeight="bold" display="block">
                      {formatCurrency(contract.price)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 150 }}>
                    <Typography variant="caption" fontWeight="bold" display="block">
                      {formatCurrency(contract.deposit)}
                    </Typography>
                    {(!contract.deposit || Number(contract.deposit) === 0) && (
                      <Typography variant="caption" color="error" sx={{ fontSize: '0.65rem' }}>
                        (Chua thu tien coc)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 120 }}>
                    <Typography variant="caption">
                      {COLLECTION_CYCLE_LABELS[String(contract.collectioncycle ?? '')] || 'Khong xac dinh'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 160 }}>
                    <Typography variant="caption">
                      {contract.contractTemplate?.templatename ||
                        contract.contracttemplate?.templatename ||
                        'Chua chon'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 115 }}>
                    <Typography variant="caption">{formatDate(contract.createdate)}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 115 }}>
                    <Typography variant="caption">{formatDate(contract.moveinDate)}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 130 }}>
                    <Typography variant="caption">{formatDate(contract.closeContract)}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">
                      Chua ghi nhan
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 150 }}>
                    {getSignatureChip(contract.signcontract)}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #eeeeee', minWidth: 110 }}>
                    <Typography variant="caption">{contract.language || 'Khong xac dinh'}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #eeeeee', minWidth: 160 }}>
                    {getStatusChip(contract.status)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(event) => handleOpenMenu(event, contract)}
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 420,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 1
          }
        }}>
        <Grid container>
          {actionItems.map((item, index) => (
            <Grid item xs={6} key={item.action}>
              <ActionItem
                icon={item.icon}
                label={item.label}
                onClick={() => {
                  onActionClick?.(item.action, selectedContract)
                  handleCloseMenu()
                }}
                {...item.modalProps}
              />
              {index % 2 === 1 && <Divider sx={{ my: 0.5 }} />}
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Paper>
  )
}

export default ContractListTable
