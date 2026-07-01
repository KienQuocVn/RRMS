import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityIcon from '@mui/icons-material/Security';

const cardStyle = {
  bgcolor: '#ffffff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const iconCircleStyle = (bg) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  bgcolor: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const BillSummaryCards = ({ paidTotal = "24.500.000 đ", pendingTotal = "6.250.000 đ", overdueTotal = "0 đ" }) => {
  return (
    <Box
      sx={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: '12px',
      }}
    >
      {/* Card 1 — Tổng đã thanh toán */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
            Tổng đã thanh toán (2024)
          </Typography>
          <Box sx={iconCircleStyle('#EAF3DE')}>
            <CheckIcon sx={{ color: '#27500A', fontSize: '14px' }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: '22px', fontWeight: 500, color: '#1a1a1a', marginTop: '6px' }}>
          {paidTotal}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <TrendingUpIcon sx={{ color: '#27500A', fontSize: '12px' }} />
          <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>
            4 hóa đơn năm nay
          </Typography>
        </Box>
      </Box>

      {/* Card 2 — Đang chờ thanh toán */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
            Đang chờ thanh toán
          </Typography>
          <Box sx={iconCircleStyle('#E6F1FB')}>
            <AccessTimeIcon sx={{ color: '#20a9e7', fontSize: '14px' }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: '22px', fontWeight: 500, color: '#20a9e7', marginTop: '6px' }}>
          {pendingTotal}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <InfoOutlinedIcon sx={{ color: '#20a9e7', fontSize: '12px' }} />
          <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>
            1 lần thanh toán: 05/05
          </Typography>
        </Box>
      </Box>

      {/* Card 3 — Quá hạn */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
            Quá hạn
          </Typography>
          <Box sx={iconCircleStyle('#FCEBEB')}>
            <WarningAmberIcon sx={{ color: '#E24B4A', fontSize: '14px' }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: '22px', fontWeight: 500, color: '#5F5E5A', marginTop: '6px' }}>
          {overdueTotal}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <SecurityIcon sx={{ color: '#27500A', fontSize: '12px' }} />
          <Typography sx={{ fontSize: '11px', color: '#27500A', fontWeight: 500 }}>
            Tài khoản đang an toàn
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BillSummaryCards;
