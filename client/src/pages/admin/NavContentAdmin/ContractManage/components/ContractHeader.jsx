import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const ContractHeader = ({ onAddContract }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Tất cả hợp đồng
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
          Danh sách hợp đồng được tạo khi thêm phiên bản ở mới
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onAddContract}
          sx={{
            bgcolor: '#20a9e7',
            color: 'white',
            '&:hover': { bgcolor: '#1988bd' },
            width: 40,
            height: 40,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <AddIcon />
        </IconButton>
        
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            startIcon={<DescriptionOutlinedIcon />}
            sx={{
              bgcolor: '#ffc107',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '4px',
              padding: '6px 16px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#e0a800', boxShadow: 'none' }
            }}
          >
            Thiết lập mẫu hợp đồng
          </Button>
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: '#dc3545',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '10px',
              border: '1px solid white',
              zIndex: 1
            }}
          >
            Pro
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractHeader;
