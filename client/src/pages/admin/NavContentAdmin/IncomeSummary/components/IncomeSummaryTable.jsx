import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { Fragment, useState } from 'react'

const formatDateDisplay = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatMonthLabel = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
}

const getPaymentName = (transaction) => transaction?.payment?.paymentName || transaction?.paymentName || '--'

const getSourceLabel = () => 'Tự tạo'

const getRecurringLabel = () => 'Không lặp lại'

const renderTypeChip = (transactionType) => {
  const isReceipt = transactionType === true

  return (
    <Chip
      size="small"
      label={isReceipt ? 'Khoản thu' : 'Khoản chi'}
      sx={{
        height: 22,
        fontWeight: 700,
        backgroundColor: isReceipt ? '#2b7ed7' : '#ef4444',
        color: '#fff'
      }}
    />
  )
}

const getGroupKey = (transaction, reportView) => {
  return reportView === 'month'
    ? formatMonthLabel(transaction?.transactionDate)
    : formatDateDisplay(transaction?.transactionDate)
}

const buildGroupedTransactions = (transactions, reportView) => {
  const groups = []
  const lookup = new Map()

  transactions.forEach((transaction) => {
    const key = getGroupKey(transaction, reportView)

    if (!lookup.has(key)) {
      const group = { key, items: [] }
      lookup.set(key, group)
      groups.push(group)
    }

    lookup.get(key).items.push(transaction)
  })

  return groups
}

const headerCellStyles = {
  fontWeight: 700,
  color: '#101828',
  backgroundColor: '#fff'
}

const bodyCellStyles = {
  verticalAlign: 'top',
  color: '#344054',
  borderColor: '#eaecf0'
}

const emptyStateStyles = {
  py: 8,
  textAlign: 'center'
}

const IncomeSummaryTable = ({ transactions, reportView, formatCurrency, onOpenDetails, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const open = Boolean(anchorEl)
  const groupedTransactions = buildGroupedTransactions(transactions, reportView)

  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget)
    setSelectedTransaction(transaction)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTransaction(null)
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden', borderColor: '#d8e1eb' }}>
      <TableContainer sx={{ maxHeight: 620 }}>
        <Table stickyHeader sx={{ minWidth: 1360 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellStyles, width: 74 }} />
              <TableCell sx={{ ...headerCellStyles, minWidth: 220 }}>Danh mục thu/chi</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 320 }}>Nội dung thanh toán</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 180 }}>Người thanh toán / nhận</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 150 }}>Số tiền</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 150 }}>Phương thức thanh toán</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 150 }}>Ngày ghi nhận thu/chi</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 140 }}>Ngày tạo phiếu</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 140 }}>Nguồn phát sinh</TableCell>
              <TableCell sx={{ ...headerCellStyles, minWidth: 120 }}>Tự tạo hàng tháng</TableCell>
              <TableCell sx={{ ...headerCellStyles, width: 90, textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {groupedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} sx={emptyStateStyles}>
                  <Stack spacing={1} alignItems="center">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 30, color: '#98a2b3' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#344054' }}>
                      Không có dữ liệu thu chi phù hợp
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#667085' }}>
                      Hãy thử đổi bộ lọc hoặc thêm phiếu thu/chi mới.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : null}

            {groupedTransactions.map((group) => (
              <Fragment key={group.key}>
                <TableRow>
                  <TableCell
                    colSpan={11}
                    sx={{
                      backgroundColor: '#eaf3fb',
                      borderColor: '#d0e0ef',
                      py: 1.25
                    }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                      <Typography sx={{ fontWeight: 700, color: '#101828' }}>{group.key}</Typography>
                      <Typography sx={{ color: '#2563eb', fontWeight: 700 }}>({group.items.length} khoản)</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>

                {group.items.map((transaction) => {
                  const isReceipt = transaction.transactionType === true

                  return (
                    <TableRow key={transaction.transactionId} hover>
                      <TableCell sx={bodyCellStyles}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: isReceipt ? '#ffe2e0' : '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          <PaymentsOutlinedIcon sx={{ color: isReceipt ? '#2b7ed7' : '#ef4444' }} />
                        </Box>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Typography sx={{ fontWeight: 700, color: '#101828', mb: 0.75 }}>
                          {transaction.category || '--'}
                        </Typography>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          {renderTypeChip(transaction.transactionType)}
                          <Chip
                            size="small"
                            label={getSourceLabel(transaction)}
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              backgroundColor: '#eef2ff',
                              color: '#4338ca'
                            }}
                          />
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Typography sx={{ color: '#344054' }}>{transaction.paymentDescription || '--'}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Typography sx={{ color: '#344054' }}>{transaction.payerName || '--'}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Typography sx={{ fontWeight: 800, color: '#101828' }}>
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Chip
                          size="small"
                          label={getPaymentName(transaction)}
                          sx={{
                            fontWeight: 700,
                            backgroundColor: '#111827',
                            color: '#fff'
                          }}
                        />
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>{formatDateDisplay(transaction.transactionDate)}</TableCell>
                      <TableCell sx={bodyCellStyles}>{formatDateDisplay(transaction.transactionDate)}</TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Typography sx={{ color: '#2563eb', fontWeight: 600 }}>
                          {getSourceLabel(transaction)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={bodyCellStyles}>
                        <Chip
                          size="small"
                          label={getRecurringLabel(transaction)}
                          sx={{
                            fontWeight: 700,
                            backgroundColor: '#dcfce7',
                            color: '#15803d'
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ ...bodyCellStyles, textAlign: 'center' }}>
                        <IconButton onClick={(event) => handleMenuOpen(event, transaction)}>
                          <MoreVertRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180
          }
        }}>
        <MenuItem
          onClick={() => {
            onOpenDetails(selectedTransaction)
            handleMenuClose()
          }}>
          <VisibilityOutlinedIcon sx={{ mr: 1.25, fontSize: 18 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(selectedTransaction?.transactionId)
            handleMenuClose()
          }}
          sx={{ color: '#d92d20' }}>
          <RemoveCircleOutlineRoundedIcon sx={{ mr: 1.25, fontSize: 18 }} />
          Xóa phiếu
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default IncomeSummaryTable
