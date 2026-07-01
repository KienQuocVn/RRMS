import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import GetAppIcon from '@mui/icons-material/GetApp';

const ContractStatusBanner = ({ title = "Hợp đồng thuê phòng 102", status = "ĐANG HIỆU LỰC", expiryDate = "31/10/2026", onDownloadPDF }) => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '16px',
      }}
    >
      {/* Left side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Icon block */}
        <Box
          sx={{
            width: '44px',
            height: '44px',
            bgcolor: '#E6F1FB',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: '22px', color: '#20a9e7' }} />
        </Box>

        {/* Text block */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Title row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#1a1a1a' }}>
              {title}
            </Typography>
            <Box
              sx={{
                bgcolor: '#EAF3DE',
                color: '#27500A',
                fontSize: '11px',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: '20px',
                letterSpacing: '0.03em',
              }}
            >
              {status}
            </Box>
          </Box>

          {/* Sub row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: '13px' }} />
            <Typography sx={{ fontSize: '13px' }}>
              Còn hiệu lực đến {expiryDate}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Button */}
      <Button
        onClick={onDownloadPDF}
        variant="contained"
        startIcon={<GetAppIcon sx={{ fontSize: 15 }} />}
        sx={{
          bgcolor: '#20a9e7',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#2b7ed7',
            boxShadow: 'none',
          },
        }}
      >
        Tải hợp đồng PDF
      </Button>
    </Box>
  );
};

export default ContractStatusBanner;
