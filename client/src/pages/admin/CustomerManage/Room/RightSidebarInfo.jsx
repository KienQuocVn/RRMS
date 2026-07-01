import React from 'react';
import { Box, Typography, Button, Avatar, Link } from '@mui/material';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const sectionCardStyle = {
  bgcolor: '#ffffff',
  border: '0.5px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px',
};

const labelStyle = {
  fontSize: '11px',
  textTransform: 'uppercase',
  color: '#9ca3af',
  letterSpacing: '0.06em',
  fontWeight: 600,
  marginBottom: '12px',
};

const RightSidebarInfo = () => {
  const landlordAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=cover&w=150&q=80'; // Avatar chủ trọ

  const rules = [
    "Giờ giặt tự do, chìa khóa riêng.",
    "Giữ gìn vệ sinh chung, không xả rác bừa bãi.",
    "Hạn chế tiếng ồn sau 22:00 đêm.",
    "Không nuôi thú cưng trong phòng."
  ];

  return (
    <Box sx={{ flex: '0 0 calc(42% - 16px)', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Card 1 — Thông tin chủ trọ */}
      <Box sx={sectionCardStyle}>
        <Typography sx={labelStyle}>Thông tin chủ trọ</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            src={landlordAvatar}
            alt="Nguyễn Văn An"
            sx={{
              width: '44px',
              height: '44px',
              border: '2px solid #20a9e7'
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
              Nguyễn Văn An
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Chủ sở hữu hệ thống Nhà Trọ An Bình
            </Typography>
          </Box>
        </Box>

        <Box sx={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Nút Gọi điện */}
          <Button
            component="a"
            href="tel:0901234567"
            variant="contained"
            fullWidth
            startIcon={<CallOutlinedIcon sx={{ fontSize: 15 }} />}
            sx={{
              height: '40px',
              bgcolor: '#20a9e7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#2b7ed7',
                boxShadow: 'none',
              },
            }}
          >
            Gọi điện trực tiếp
          </Button>

          {/* Nút Gửi Email */}
          <Button
            component="a"
            href="mailto:an.nguyen@rrms.com"
            variant="outlined"
            fullWidth
            startIcon={<MailOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
            sx={{
              height: '40px',
              borderColor: '#20a9e7',
              color: '#20a9e7',
              bgcolor: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#2b7ed7',
                bgcolor: '#f0f9ff',
              },
            }}
          >
            Gửi Email liên hệ
          </Button>
        </Box>
      </Box>

      {/* Card 2 — Nội quy nhà trọ */}
      <Box sx={sectionCardStyle}>
        <Typography sx={labelStyle}>Nội quy nhà trọ</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rules.map((rule, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: '15px', color: '#20a9e7', flexShrink: 0, marginTop: '2px' }} />
              <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
                {rule}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Card 3 — Vị trí trên bản đồ */}
      <Box sx={{ ...sectionCardStyle, padding: 0 }}>
        {/* Header */}
        <Box sx={{ padding: '12px 16px' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
            Vị trí nhà trọ
          </Typography>
        </Box>

        {/* Map Area */}
        <Box
          sx={{
            height: '160px',
            bgcolor: '#e8f4fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
            borderTop: '0.5px solid #e5e7eb',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: '32px', color: '#20a9e7' }} />
          <Typography sx={{ fontSize: '12px', color: '#6b7280', maxWidth: '80%', lineHeight: 1.4 }}>
            123 Đường Nguyễn Huệ, Quận 1, TP.HCM
          </Typography>
          <Link
            href="https://maps.google.com/?q=123+Nguyen+Hue+Quan+1+TPHCM"
            target="_blank"
            rel="noopener"
            sx={{
              fontSize: '12px',
              color: '#20a9e7',
              fontWeight: 500,
              textDecoration: 'none',
              marginTop: '4px',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Xem trên Google Maps →
          </Link>
        </Box>
      </Box>

    </Box>
  );
};

export default RightSidebarInfo;
