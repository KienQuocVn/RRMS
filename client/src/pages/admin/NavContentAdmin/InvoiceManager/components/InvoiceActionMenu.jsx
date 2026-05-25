import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material'
import ArrowRightCircleIcon from '@mui/icons-material/ArrowCircleRight'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import SendIcon from '@mui/icons-material/Send'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'

// Menu items cho hóa đơn chưa thu
const MENU_ITEMS_UNPAID = [
  { id: 1, label: 'Xem chi tiết hóa đơn', Icon: ArrowRightCircleIcon, color: '#555' },
  { id: 2, label: 'Thu tiền', Icon: MonetizationOnIcon, color: '#20a9e7' },
  { id: 3, label: 'Chỉnh sửa', Icon: EditIcon, color: '#555' },
  { id: 4, label: 'In hóa đơn', Icon: PrintIcon, color: '#555' },
  { id: 5, label: 'Chia sẻ hóa đơn', Icon: ShareIcon, color: '#555' },
  { id: 6, label: 'Gửi hóa đơn qua App', Icon: SendIcon, color: '#555' },
  { id: 7, label: 'Gửi hóa đơn qua Zalo', Icon: SendIcon, color: '#555' },
  { id: 8, label: 'Hủy hóa đơn', Icon: CancelIcon, color: '#ef5350', dividerBefore: true }
]

// Menu items cho hóa đơn đã thu / đã hủy
const MENU_ITEMS_PAID = [
  { id: 1, label: 'Xem chi tiết hóa đơn', Icon: ArrowRightCircleIcon, color: '#555' },
  { id: 2, label: 'Gửi hóa đơn qua App', Icon: SendIcon, color: '#555' },
  { id: 3, label: 'In hóa đơn', Icon: PrintIcon, color: '#555' },
  { id: 4, label: 'Chia sẻ hóa đơn', Icon: ShareIcon, color: '#555' },
  { id: 5, label: 'Gửi hóa đơn qua Zalo', Icon: SendIcon, color: '#555' },
  { id: 6, label: 'Xóa hóa đơn', Icon: DeleteIcon, color: '#ef5350', dividerBefore: true }
]

const InvoiceActionMenu = ({ menuRef, menuPosition, invoice, onItemClick }) => {
  if (!invoice || !invoice.status) return null

  const items = invoice.status === 'Chưa thu' ? MENU_ITEMS_UNPAID : MENU_ITEMS_PAID

  return (
    <Paper
      ref={menuRef}
      elevation={6}
      sx={{
        position: 'absolute',
        top: menuPosition.y - 676,
        left: menuPosition.x - 350,
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: 230,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0'
      }}>
      <MenuList dense sx={{ py: 0.5 }}>
        {items.map((item, idx) => (
          <Box key={item.id}>
            {item.dividerBefore && <Divider sx={{ my: 0.5 }} />}
            <MenuItem
              onClick={() => onItemClick(item.label)}
              sx={{
                py: 1,
                px: 2,
                gap: 1.5,
                transition: 'background 0.15s',
                '&:hover': {
                  backgroundColor: item.color === '#ef5350' ? '#fff5f5' : '#f0f8ff'
                }
              }}>
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <item.Icon sx={{ fontSize: '1.1rem', color: item.color }} />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.83rem',
                    color: item.color,
                    fontWeight: item.color === '#ef5350' ? 600 : 400
                  }}>
                  {item.label}
                </Typography>
              </ListItemText>
            </MenuItem>
          </Box>
        ))}
      </MenuList>
    </Paper>
  )
}

export default InvoiceActionMenu
