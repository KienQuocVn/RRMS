import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { Box, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'

function AdditionItem({ item, index, onRemove, onChange }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: 'hidden',
        borderRadius: 2,
        borderColor: '#2f6fed',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr) 90px' }
      }}
    >
      <Box sx={{ borderRight: { md: '1px solid #e5e7eb' }, backgroundColor: '#fff' }}>
        <RadioGroup
          value={item.type}
          onChange={(event) => onChange(index, 'type', event.target.value)}
        >
          <FormControlLabel
            value="ADD"
            control={<Radio size="small" />}
            label="Cộng [+]"
            sx={{
              m: 0,
              px: 1.8,
              minHeight: 60,
              borderBottom: '1px solid #e5e7eb'
            }}
          />
          <FormControlLabel
            value="SUBTRACT"
            control={<Radio size="small" />}
            label="Giảm [-]"
            sx={{ m: 0, px: 1.8, minHeight: 60 }}
          />
        </RadioGroup>
      </Box>

      <Box sx={{ backgroundColor: '#fff' }}>
        <TextField
          fullWidth
          label="Số tiền (đ)"
          value={item.amount}
          onChange={(event) => onChange(index, 'amount', event.target.value)}
          placeholder="Nhập số tiền cộng thêm hoặc giảm trừ"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': { border: 'none' }
            }
          }}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Lý do"
          value={item.reason}
          onChange={(event) => onChange(index, 'reason', event.target.value)}
          placeholder="Nhập lý do"
          InputLabelProps={{ shrink: true }}
          sx={{
            borderTop: '1px solid #e5e7eb',
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': { border: 'none' }
            }
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: { md: '1px solid #f3d8d1' },
          backgroundColor: '#fff1eb',
          color: '#ef4444',
          minHeight: 120,
          cursor: 'pointer'
        }}
        onClick={() => onRemove(index)}
      >
        <Box sx={{ textAlign: 'center' }}>
          <DeleteOutlineRoundedIcon fontSize="small" />
          <Typography sx={{ mt: 0.4, fontSize: 15, fontWeight: 600 }}>Xóa</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default AdditionItem
