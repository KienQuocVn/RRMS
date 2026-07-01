import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const CompactBillList = ({ compactBills, onViewBill }) => {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        marginTop: '12px',
        overflow: 'hidden',
      }}
    >
      {compactBills.map((bill, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: index < compactBills.length - 1 ? '0.5px solid #f5f5f5' : 'none',
          }}
        >
          {/* Left: Tháng */}
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#1a1a1a',
              minWidth: '100px',
            }}
          >
            Tháng {bill.monthCompact}
          </Typography>

          {/* Middle: Tiền */}
          <Typography
            sx={{
              fontSize: '13px',
              color: '#6b7280',
            }}
          >
            {bill.totalAmount}
          </Typography>

          {/* Right: Trạng thái và nút xem */}
          <Box
            sx={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                color: '#27500A',
                fontWeight: 500,
              }}
            >
              ĐÃ THANH TOÁN ({bill.payDate})
            </Typography>
            <IconButton
              onClick={() => onViewBill(bill)}
              size="small"
              sx={{
                color: '#9ca3af',
                '&:hover': {
                  color: '#20a9e7',
                },
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CompactBillList;
