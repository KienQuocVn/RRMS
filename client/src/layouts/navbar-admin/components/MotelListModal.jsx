import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import HomeIcon from '@mui/icons-material/Home'

const MotelListModal = ({ open, onClose, motels, currentMotel, onDelete, onEdit }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        maxWidth: 500,
        width: '95%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
          p: 2,
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <HomeIcon />
        <Box flex={1}>
          <Typography variant="h6">Danh sách nhà trọ của bạn</Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Tới 1 nhà trọ và quản lý
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">✕</IconButton>
      </Box>

      {/* Motel list */}
      <Box sx={{ overflowY: 'auto', p: 2 }}>
        {motels.map((item) => {
          const isCurrent = currentMotel?.motelId === item.motelId

          return (
            <Box
              key={item.motelId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                borderRadius: 1,
                border: '1px solid rgba(34,36,38,.15)',
                mb: 1,
                bgcolor: isCurrent ? '#20a9e7' : 'transparent',
                color: isCurrent ? '#fff' : 'inherit',
              }}
            >
              <Box flex={1}>
                <Typography fontWeight="bold">{item.motelName}</Typography>
                <Typography variant="body2">{item.address}</Typography>
              </Box>

              {/* Delete */}
              <Tooltip title={isCurrent ? 'Không thể xóa nhà trọ đang thao tác' : 'Xóa nhà trọ'}>
                <span>
                  <IconButton
                    onClick={() => !isCurrent && onDelete(item.motelId)}
                    disabled={isCurrent}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>

              {/* Edit */}
              <Tooltip title="Chỉnh sửa nhà trọ">
                <IconButton size="small" onClick={() => onEdit(item.motelId)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>

              {/* Navigate */}
              <Tooltip title="Tới quản lý nhà trọ">
                <IconButton component="a" href={`/quanlytro/${item.motelId}`} size="small">
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        })}
      </Box>
    </Box>
  </Modal>
)

export default MotelListModal
