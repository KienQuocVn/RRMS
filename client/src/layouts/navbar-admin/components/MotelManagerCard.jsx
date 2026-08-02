import { Box, Tooltip, IconButton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'

const MotelManagerCard = ({ motel, motelCount, onOpenManager, onOpenAdd, setSelectedMotelId }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, ml: 1 }}>
    {/* Motel info card */}
    <Box
      onClick={onOpenManager}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        bgcolor: '#fff',
        p: '8px 10px',
        border: '5px solid rgba(51,100,169,.22)',
        cursor: 'pointer',
        minWidth: 270,
        flex: 1,
      }}
    >
      <Box sx={{ position: 'relative', mr: 1 }}>
        <Box
          sx={{
            bgcolor: '#20a9e7',
            color: '#fff',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HomeIcon fontSize="small" />
        </Box>
        {/* Count badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: -7,
            bgcolor: '#f44336',
            border: '1px solid #fff',
            width: 20,
            height: 20,
            borderRadius: '50%',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          {motelCount}
        </Box>
      </Box>

      <Box>
        <Box sx={{ fontSize: 17 }}>Đang quản lý</Box>
        <Box
          sx={{
            fontSize: 18,
            color: '#20a9e7',
            whiteSpace: 'nowrap',
            maxWidth: 270,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
          }}
        >
          {motel?.motelName ?? 'Chưa có dữ liệu'}
        </Box>
      </Box>
    </Box>

    {/* Add motel button */}
    <Tooltip title="Thêm mới nhà cho thuê" placement="top">
      <IconButton
        onClick={() => {
          setSelectedMotelId('Create')
          onOpenAdd()
        }}
        sx={{
          ml: '-20px',
          bgcolor: '#20a9e7',
          color: '#fff',
          width: 40,
          height: 40,
          zIndex: 10,
          boxShadow: 2,
          '&:hover': { bgcolor: '#1791c8' },
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  </Box>
)

export default MotelManagerCard
