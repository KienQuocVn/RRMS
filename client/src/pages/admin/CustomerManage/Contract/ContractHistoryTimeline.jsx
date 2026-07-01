import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckIcon from '@mui/icons-material/Check';

const ContractHistoryTimeline = () => {
  const handleViewArchive = () => {
    alert('Đang hiển thị bản lưu trữ hợp đồng cũ HD-2023-102-01');
  };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        padding: '20px',
        marginTop: '16px',
      }}
    >
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <HistoryIcon sx={{ fontSize: '16px', color: '#20a9e7' }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
          Lịch sử hợp đồng
        </Typography>
      </Box>

      {/* Timeline container */}
      <Box sx={{ position: 'relative', paddingLeft: '40px' }}>
        
        {/* Vertical Line */}
        <Box
          sx={{
            position: 'absolute',
            left: '19px',
            top: '0px',
            bottom: '0px',
            width: '2px',
            bgcolor: '#e5e7eb',
          }}
        />

        {/* Timeline Item 1 — Current contract (ACTIVE) */}
        <Box sx={{ position: 'relative', marginBottom: '24px' }}>
          {/* Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: '-40px',
              top: '0px',
              width: '36px',
              height: '36px',
              bgcolor: '#20a9e7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <CheckIcon sx={{ color: '#ffffff', fontSize: '18px' }} />
          </Box>

          {/* Content Card */}
          <Box
            sx={{
              bgcolor: '#f0f9ff',
              borderRadius: '10px',
              border: '0.5px solid #b3ddf5',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left text */}
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                Hợp đồng hiện tại: HD-2024-102-01
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Thời hạn: 01/11/2024 – 31/10/2026
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '2px' }}>
                Gia hạn từ hợp đồng cũ với mức giá mới (tăng 5%).
              </Typography>
            </Box>

            {/* Right badge */}
            <Box
              sx={{
                bgcolor: '#EAF3DE',
                color: '#27500A',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
              }}
            >
              ĐANG ÁP DỤNG
            </Box>
          </Box>
        </Box>

        {/* Timeline Item 2 — Old contract (EXPIRED) */}
        <Box sx={{ position: 'relative' }}>
          {/* Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: '-40px',
              top: '0px',
              width: '36px',
              height: '36px',
              bgcolor: '#f1f0eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <HistoryIcon sx={{ color: '#888780', fontSize: '18px' }} />
          </Box>

          {/* Content Card */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: '10px',
              border: '0.5px solid #e5e7eb',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left text */}
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                Hợp đồng cũ: HD-2023-102-01
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Thời hạn: 01/11/2023 – 31/10/2024
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>
                  Giá thuê: 3,300,000 VND
                </Typography>
                <Link
                  component="button"
                  onClick={handleViewArchive}
                  sx={{
                    fontSize: '12px',
                    color: '#20a9e7',
                    textDecoration: 'none',
                    fontWeight: 500,
                    border: 'none',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    p: 0,
                    fontFamily: 'inherit',
                    '&:hover': {
                      color: '#2b7ed7',
                    },
                  }}
                >
                  Xem lưu trữ
                </Link>
              </Box>
            </Box>

            {/* Right badge */}
            <Box
              sx={{
                bgcolor: '#F1EFE8',
                color: '#5F5E5A',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
              }}
            >
              ĐÃ HẾT HẠN
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default ContractHistoryTimeline;
