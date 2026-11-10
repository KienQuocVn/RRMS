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

const dash = (v) => v ?? '—';

const RightSidebarInfo = ({ room = {}, motel = {} }) => {
  // Thông tin chủ trọ từ motel hoặc room
  const ownerName = motel?.ownerName ?? room?.ownerName ?? room?.hostName ?? null;
  const ownerPhone = motel?.ownerPhone ?? room?.ownerPhone ?? null;
  const ownerEmail = motel?.ownerEmail ?? room?.ownerEmail ?? null;
  const ownerAvatar = motel?.ownerAvatar ?? room?.ownerAvatar ?? null;
  const ownerDesc = motel?.motelName ?? motel?.name ?? null;

  // Nội quy nhà trọ từ motel
  const rules = Array.isArray(motel?.rules)
    ? motel.rules
    : Array.isArray(room?.rules)
    ? room.rules
    : [];

  // Địa chỉ
  const address = room?.address ?? motel?.address ?? null;
  const mapsQuery = address ? encodeURIComponent(address) : null;

  return (
    <Box sx={{ flex: '0 0 calc(42% - 16px)', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Card 1 — Thông tin chủ trọ */}
      <Box sx={sectionCardStyle}>
        <Typography sx={labelStyle}>Thông tin chủ trọ</Typography>
        {ownerName ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                src={ownerAvatar}
                alt={ownerName}
                sx={{ width: '44px', height: '44px', border: '2px solid #20a9e7', bgcolor: '#20a9e7', fontSize: 18 }}
              >
                {!ownerAvatar && ownerName?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                  {ownerName}
                </Typography>
                {ownerDesc && (
                  <Typography
                    sx={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ownerDesc}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ownerPhone && (
                <Button
                  component="a"
                  href={`tel:${ownerPhone}`}
                  variant="contained"
                  fullWidth
                  startIcon={<CallOutlinedIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    height: '40px', bgcolor: '#20a9e7', color: '#ffffff',
                    fontSize: '13px', fontWeight: 500, textTransform: 'none',
                    borderRadius: '8px', boxShadow: 'none',
                    '&:hover': { bgcolor: '#2b7ed7', boxShadow: 'none' },
                  }}
                >
                  Gọi điện trực tiếp
                </Button>
              )}
              {ownerEmail && (
                <Button
                  component="a"
                  href={`mailto:${ownerEmail}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<MailOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    height: '40px', borderColor: '#20a9e7', color: '#20a9e7',
                    bgcolor: '#ffffff', fontSize: '13px', fontWeight: 500,
                    textTransform: 'none', borderRadius: '8px',
                    '&:hover': { borderColor: '#2b7ed7', bgcolor: '#f0f9ff' },
                  }}
                >
                  Gửi Email liên hệ
                </Button>
              )}
              {!ownerPhone && !ownerEmail && (
                <Typography sx={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', py: 1 }}>
                  Chưa có thông tin liên hệ
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography sx={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', py: 2 }}>
            Chưa có thông tin chủ trọ
          </Typography>
        )}
      </Box>

      {/* Card 2 — Nội quy nhà trọ */}
      <Box sx={sectionCardStyle}>
        <Typography sx={labelStyle}>Nội quy nhà trọ</Typography>
        {rules.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rules.map((rule, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: '15px', color: '#20a9e7', flexShrink: 0, marginTop: '2px' }} />
                <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
                  {typeof rule === 'string' ? rule : rule?.content ?? rule?.rule ?? ''}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', py: 1 }}>
            Chưa có nội quy
          </Typography>
        )}
      </Box>

      {/* Card 3 — Vị trí trên bản đồ */}
      <Box sx={{ ...sectionCardStyle, padding: 0 }}>
        <Box sx={{ padding: '12px 16px' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
            Vị trí nhà trọ
          </Typography>
        </Box>
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
            {address ?? 'Chưa có địa chỉ'}
          </Typography>
          {mapsQuery && (
            <Link
              href={`https://maps.google.com/?q=${mapsQuery}`}
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: '12px', color: '#20a9e7', fontWeight: 500,
                textDecoration: 'none', marginTop: '4px',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Xem trên Google Maps →
            </Link>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default RightSidebarInfo;
