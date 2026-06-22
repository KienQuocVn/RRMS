import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CloseIcon from '@mui/icons-material/Close'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined'
import Swal from 'sweetalert2'
import { collectInvoicePayment } from '~/apis/invoiceAPI'

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`

const formatDate = (dateText) => {
  if (!dateText) return new Date().toLocaleDateString('vi-VN')
  const date = new Date(dateText)
  return Number.isNaN(date.getTime()) ? dateText : date.toLocaleDateString('vi-VN')
}

const sumTransactions = (transactions = []) =>
  transactions.reduce((total, transaction) => total + Number(transaction.amount || transaction.totalAmount || 0), 0)

const getRemainingAmount = (invoice) => Math.max(0, Number(invoice?.totalAmount || 0) - sumTransactions(invoice?.transactions))

const getPayerName = (invoice, room, contract) =>
  invoice?.payerName ||
  invoice?.tenantName ||
  contract?.tenantName ||
  contract?.renterName ||
  contract?.customerName ||
  contract?.account?.fullname ||
  contract?.account?.username ||
  room?.name ||
  'khách thuê'

const getPayerPhone = (contract) =>
  contract?.phone || contract?.phoneNumber || contract?.account?.phone || contract?.account?.phoneNumber || ''

const InvoicePaymentCard = ({ invoice, room, contract, loading, onCollect, onDetail }) => {
  const paidAmount = sumTransactions(invoice?.transactions)
  const totalAmount = Number(invoice?.totalAmount || 0)
  const remainingAmount = getRemainingAmount(invoice)
  const payerName = getPayerName(invoice, room, contract)
  const payerPhone = getPayerPhone(contract)

  return (
    <Paper variant="outlined" sx={{ p: 1.2, borderRadius: 1 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            bgcolor: '#F3F3F3',
            color: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexShrink: 0
          }}>
          <SummarizeOutlinedIcon sx={{ fontSize: 44 }} />
          <Typography variant="caption" sx={{ color: '#FF7B00', fontWeight: 700 }}>
            Chưa thu
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 17 }} noWrap>
                {payerName} -
              </Typography>
              {payerPhone ? <Typography variant="body2">{payerPhone}</Typography> : null}
              <Typography variant="body2">
                Lý do:<Box component="span" sx={{ fontWeight: 800 }}>{invoice.invoiceReason}</Box>
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{formatDate(invoice.invoiceCreateDate)}</Typography>
            </Stack>
          </Stack>

          <Paper elevation={0} sx={{ mt: 1, p: 1, bgcolor: '#FFF1F1', borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography variant="body2">Tổng tiền</Typography>
                <Typography sx={{ color: '#FF0000', fontWeight: 900, textDecoration: 'underline' }}>
                  {formatCurrency(totalAmount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">Đã thu</Typography>
                <Typography sx={{ color: '#20a9e7', fontWeight: 900, textDecoration: 'underline' }}>
                  {formatCurrency(paidAmount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">Còn lại</Typography>
                <Typography sx={{ color: '#000', fontWeight: 900, textDecoration: 'underline' }}>
                  {formatCurrency(remainingAmount)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>

      <Stack direction="row" spacing={0.6} sx={{ mt: 1.2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<ReceiptLongOutlinedIcon />}
          onClick={() => onDetail?.(invoice)}
          sx={{ fontWeight: 800 }}>
          Chi tiết
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<PrintOutlinedIcon />}
          onClick={() => window.print()}
          sx={{ fontWeight: 800 }}>
          In hóa đơn
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          disabled={loading || remainingAmount <= 0}
          onClick={() => onCollect(invoice)}
          sx={{ fontWeight: 900 }}>
          Thu nhanh
        </Button>
      </Stack>
    </Paper>
  )
}

const CollectPaymentModal = ({ open, onClose, invoice, invoices = [], room, contract, onCollected, onDetail }) => {
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null)

  const invoiceList = useMemo(() => {
    const list = invoices.length > 0 ? invoices : invoice ? [invoice] : []
    return list
      .filter(Boolean)
      .filter((item, index, all) => all.findIndex((current) => current.invoiceId === item.invoiceId) === index)
      .filter((item) => item.paymentStatus !== 'PAID' && item.paymentStatus !== 'CANCELED')
  }, [invoice, invoices])

  const payerName = getPayerName(invoiceList[0] || invoice, room, contract)

  const handleQuickCollect = async (selectedInvoice) => {
    const remainingAmount = getRemainingAmount(selectedInvoice)
    if (!selectedInvoice?.invoiceId || remainingAmount <= 0) return

    try {
      setLoadingInvoiceId(selectedInvoice.invoiceId)
      const response = await collectInvoicePayment(selectedInvoice.invoiceId, {
        totalAmount: remainingAmount,
        paymentName: `Thu tiền hóa đơn ${selectedInvoice.roomName || room?.name || ''}`.trim(),
        description: `Thu tiền hóa đơn ${selectedInvoice.invoiceReason || ''}`.trim(),
        paymentDate: new Date().toISOString().slice(0, 10)
      })
      const paidInvoice = response?.result || { ...selectedInvoice, paymentStatus: 'PAID' }
      await Swal.fire({
        icon: 'success',
        title: 'Đã thu tiền',
        text: 'Hóa đơn đã được cập nhật trạng thái thanh toán.'
      })
      onCollected?.(paidInvoice)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Thu tiền thất bại',
        text: error?.response?.data?.message || error.message || 'Không thể thu tiền hóa đơn.'
      })
    } finally {
      setLoadingInvoiceId(null)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 492, maxWidth: 'calc(100vw - 24px)', borderRadius: 0, m: 1.5 } }}>
      <Box sx={{ px: 1.2, py: 1.1, borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#ddf1f4',
                color: '#20a9e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <GroupsOutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#242424' }}>Hóa đơn cần thu {payerName}</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ border: '3px solid #FBE6DE', width: 42, height: 42 }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 1.2 }}>
        {invoiceList.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Chưa có hóa đơn cần thu</Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Phòng này chưa có hóa đơn chưa thanh toán để thực hiện thu tiền.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1}>
            {invoiceList.map((item) => (
              <InvoicePaymentCard
                key={item.invoiceId}
                invoice={item}
                room={room}
                contract={contract}
                loading={loadingInvoiceId === item.invoiceId}
                onCollect={handleQuickCollect}
                onDetail={onDetail}
              />
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 1.2, bgcolor: '#F8F8F8', borderTop: '1px solid #E5E7EB' }}>
        <Button variant="contained" color="inherit" onClick={onClose} sx={{ bgcolor: '#737B83', color: '#fff' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CollectPaymentModal
