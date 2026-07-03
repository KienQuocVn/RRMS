import { Menu, MenuItem } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const AssetActionMenu = ({ anchorEl, onClose, onEdit, onDelete }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 160 }
      }}
    >
      <MenuItem onClick={onEdit} sx={{ fontSize: '0.85rem', gap: 1 }}>
        <EditOutlinedIcon fontSize="small" />
        Chỉnh sửa tài sản
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: '#e53935', fontSize: '0.85rem', gap: 1 }}>
        <DeleteOutlineIcon fontSize="small" />
        Xóa tài sản
      </MenuItem>
    </Menu>
  )
}

export default AssetActionMenu
