import { useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'
import Swal from 'sweetalert2'

const APP_PROMO_LINK = 'http://localhost:5173/AppPromo'

const TenantMenuUpdate = ({
  tenantId,
  onViewResidenceForm,
  onPrintResidenceForm,
  onEditTenant,
  onDeleteTenant
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const residenceLink = `${window.location.origin}/ResidenceForm/${tenantId}`

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const runAction = (callback) => () => {
    handleCloseMenu()
    callback?.()
  }

  const copyToClipboard = async (link, successText, confirmAction) => {
    try {
      await navigator.clipboard.writeText(link)

      const result = await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: successText,
        showCancelButton: true,
        confirmButtonText: 'Mở liên kết',
        cancelButtonText: 'Đóng'
      })

      if (result.isConfirmed) {
        confirmAction?.()
      }
    } catch (error) {
      console.error('Copy link failed:', error)
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Không thể sao chép liên kết.'
      })
    }
  }

  const handleShareResidence = () => {
    copyToClipboard(
      residenceLink,
      'Đã sao chép liên kết mẫu văn bản tạm trú. Bạn có thể chia sẻ cho bên thứ ba.',
      () => onViewResidenceForm?.(tenantId)
    )
  }

  const handleInviteTenant = () => {
    copyToClipboard(
      APP_PROMO_LINK,
      'Đã sao chép liên kết tạo tài khoản khách thuê để chia sẻ qua APP.',
      () => window.open(APP_PROMO_LINK, '_blank', 'noopener,noreferrer')
    )
  }

  return (
    <>
      <IconButton
        onClick={handleOpenMenu}
        sx={{
          width: 32,
          height: 32,
          border: '1px solid #1f2937',
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#f8fafc'
          }
        }}>
        <MoreHorizRoundedIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 320,
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}>
        <MenuItem onClick={runAction(() => onViewResidenceForm?.(tenantId))}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Xem mẫu văn bản tạm trú" />
        </MenuItem>

        <MenuItem onClick={runAction(() => onPrintResidenceForm?.(tenantId))}>
          <ListItemIcon>
            <PrintOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="In mẫu văn bản tạm trú" />
        </MenuItem>

        <MenuItem onClick={runAction(handleShareResidence)}>
          <ListItemIcon>
            <IosShareOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Chia sẻ mẫu văn bản tạm trú" />
        </MenuItem>

        <MenuItem onClick={runAction(handleInviteTenant)}>
          <ListItemIcon>
            <PersonAddAlt1OutlinedIcon fontSize="small" sx={{ color: 'success.main' }} />
          </ListItemIcon>
          <ListItemText
            primary="Tạo tài khoản khách thuê"
            secondary="Khách sử dụng APP để kết nối với bạn"
            primaryTypographyProps={{ fontWeight: 700, color: 'success.main' }}
            secondaryTypographyProps={{ color: 'text.secondary' }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={runAction(() => onEditTenant?.(tenantId))}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Chỉnh sửa thông tin khách thuê" />
        </MenuItem>

        <MenuItem onClick={runAction(() => onDeleteTenant?.(tenantId))} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Xóa khách thuê" />
        </MenuItem>

        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <CloseRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Đóng menu" />
        </MenuItem>
      </Menu>
    </>
  )
}

export default TenantMenuUpdate
