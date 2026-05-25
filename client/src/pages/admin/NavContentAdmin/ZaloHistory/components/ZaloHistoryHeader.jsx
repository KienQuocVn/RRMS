import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { Box, FormControl, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'

const ZaloHistoryHeader = ({ motelName, roomOptions, selectedRoom, onSelectedRoomChange }) => {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', lg: 'center' }}>
      <Box sx={{ borderLeft: '4px solid #3fb950', pl: 1.5 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.75rem', md: '2.05rem' }, fontWeight: 700, color: '#263238' }}>
          Lịch sử gửi hóa đơn qua zalo cho khách thuê
        </Typography>
        <Typography variant="body2" sx={{ color: '#667085', fontStyle: 'italic', mt: 0.25 }}>
          {motelName ? `Theo dõi lịch sử gửi hóa đơn qua Zalo của ${motelName}` : 'Lịch sử gửi hóa đơn qua zalo cho khách thuê'}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="stretch" sx={{ width: { xs: '100%', lg: 'auto' } }}>
        <FormControl size="small" sx={{ minWidth: { xs: 1, sm: 320 } }}>
          <Select
            value={selectedRoom}
            onChange={(event) => onSelectedRoomChange(event.target.value)}
            displayEmpty
            IconComponent={KeyboardArrowDownRoundedIcon}
            sx={{
              minHeight: 58,
              borderRadius: 2,
              backgroundColor: '#fff',
              '& .MuiSelect-select': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.15,
                py: 1.05
              }
            }}
            renderValue={(value) => {
              const displayLabel = value === 'all' ? 'Tất cả' : value

              return (
                <Box>
                  <Typography variant="caption" sx={{ color: '#98a2b3', display: 'block' }}>
                    Lọc theo giường
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#101828', fontWeight: 500 }}>
                    {displayLabel}
                  </Typography>
                </Box>
              )
            }}>
            <MenuItem value="all">Tất cả</MenuItem>
            {roomOptions.map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          sx={{
            width: 50,
            borderRadius: 2,
            border: '1px solid #d0d5dd',
            color: '#101828'
          }}>
          <CalendarTodayOutlinedIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default ZaloHistoryHeader
