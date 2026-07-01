import React from 'react';
import { Box, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const EmptyState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60px',
        textAlign: 'center',
      }}
    >
      <ReceiptIcon
        sx={{
          fontSize: '48px',
          color: '#20a9e7',
          opacity: 0.35,
          marginBottom: '12px',
        }}
      />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#1a1a1a',
        }}
      >
        Chưa có hóa đơn nào
      </Typography>
      <Typography
        sx={{
          fontSize: '13px',
          color: '#6b7280',
          marginTop: '6px',
        }}
      >
        Thử thay đổi bộ lọc năm hoặc trạng thái
      </Typography>
    </Box>
  );
};

export default EmptyState;
