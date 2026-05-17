import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, InputBase, IconButton, Paper, Badge } from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

const ContractFilters = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FilterAltOutlinedIcon sx={{ color: '#666', fontSize: 28 }} />
          <Badge
            badgeContent={2}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              '& .MuiBadge-badge': {
                bgcolor: Colors.success,
                color: 'white',
                minWidth: '16px',
                height: '16px',
                fontSize: '10px',
                padding: '0 4px',
              }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControlLabel
            control={<Checkbox size="small" defaultChecked sx={{ color: '#ccc', '&.Mui-checked': { color: '#ccc' } }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '13px' }}>Trong thời hạn hợp đồng</Typography>
                <Box sx={{ bgcolor: Colors.success, color: 'white', borderRadius: '10px', px: 0.8, py: 0.1, fontSize: '10px', fontWeight: 'bold' }}>2</Box>
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#ccc' }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '13px' }}>Đang báo kết thúc</Typography>
                <Box sx={{ bgcolor: Colors.success, color: 'white', borderRadius: '10px', px: 0.8, py: 0.1, fontSize: '10px', fontWeight: 'bold' }}>2</Box>
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#ccc' }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '13px' }}>Sắp đến hạn</Typography>
                <Box sx={{ bgcolor: '#ff9800', color: 'white', borderRadius: '10px', px: 0.8, py: 0.1, fontSize: '10px', fontWeight: 'bold' }}>0</Box>
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#ccc' }} />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '13px' }}>Đã quá hạn</Typography>
                <Box sx={{ bgcolor: '#757575', color: 'white', borderRadius: '10px', px: 0.8, py: 0.1, fontSize: '10px', fontWeight: 'bold' }}>0</Box>
              </Box>
            }
          />
        </Box>
      </Box>

      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, border: '1px solid #ddd', boxShadow: 'none', borderRadius: '4px', height: '36px' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '14px' }}
          placeholder="Tìm tên phòng..."
          inputProps={{ 'aria-label': 'tìm tên phòng' }}
        />
        <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
          <SearchIcon sx={{ color: '#999' }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ContractFilters;
