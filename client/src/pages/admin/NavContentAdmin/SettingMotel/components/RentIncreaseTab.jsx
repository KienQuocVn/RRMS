import { useState } from 'react'
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, Paper, InputAdornment } from '@mui/material'
import { formatVndInput, getVndInputFieldProps, parseVndInput } from '~/utils/currencyInputUtils'

const RentIncreaseTab = () => {
  const [newRentPrice, setNewRentPrice] = useState('3000000')

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Tăng giá thuê</Typography>
        <Typography variant="body2" color="textSecondary">Tăng giá thuê cho tất cả các phòng hoặc chỉ 1 số phòng</Typography>
      </Box>

      <TextField
        fullWidth
        label="Giá thuê mới *"
        value={formatVndInput(newRentPrice)}
        onChange={(event) => setNewRentPrice(parseVndInput(event.target.value))}
        variant="outlined"
        sx={{ mb: 4 }}
        InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
        {...getVndInputFieldProps()}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ borderLeft: '4px solid #2b7ed7', pl: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Chọn phòng muốn áp dụng</Typography>
          <Typography variant="body2" color="textSecondary">Danh sách phòng chọn áp dụng</Typography>
        </Box>
        <FormControlLabel control={<Checkbox color="info" />} label="Chọn tất cả" />
      </Box>

      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={num}>
            <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'flex-start', gap: 1, borderRadius: 2 }}>
              <Checkbox defaultChecked={false} color="info" sx={{ p: 0.5 }} />
              <Box>
                <Typography variant="body2">Phòng {num}</Typography>
                <Typography variant="body1" fontWeight="bold">{formatVndInput(2222222)}đ</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
export default RentIncreaseTab
