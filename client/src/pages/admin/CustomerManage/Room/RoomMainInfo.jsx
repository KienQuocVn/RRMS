import React, { useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';

const SERVICE_ICON_MAP = {
  wifi: <WifiIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
  'điều hòa': <AcUnitOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
  'máy nước nóng': <OpacityOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
  'tủ lạnh': <KitchenOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
  'bảo vệ': <SecurityOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
  'chỗ để xe': <LocalParkingOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />,
};

const getServiceIcon = (name = '') => {
  const key = name.toLowerCase();
  for (const [k, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (key.includes(k)) return icon;
  }
  return <WifiIcon sx={{ fontSize: '13px', color: '#20a9e7' }} />;
};

const dash = (v) => v ?? '—';

const fmt = (date) => {
  if (!date) return null;
  try { return new Date(date).toLocaleDateString('vi-VN'); } catch { return date; }
};

const fmtCurrency = (val) => {
  if (val == null) return null;
  return Number(val).toLocaleString('vi-VN') + ' đ/tháng';
};

const RoomMainInfo = ({ room = {}, services = [] }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const {
    roomName, roomCode, address, area, floor, direction,
    roomType, maxPeople, startDate, price, description
  } = room;

  const title = roomName ?? roomCode ?? '—';
  const priceStr = fmtCurrency(price);
  const startStr = fmt(startDate);
  const desc = description ?? '';
  const truncated = desc.length > 160 ? desc.slice(0, 157) + '...' : desc;

  const infoGridCells = [
    { label: 'DIỆN TÍCH', value: area != null ? `${area} m²` : '—', icon: <AspectRatioOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'TẦNG', value: dash(floor), icon: <LayersOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'HƯỚNG', value: dash(direction), icon: <ExploreOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'LOẠI PHÒNG', value: dash(roomType), icon: <HomeOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'SỐ NGƯỜI', value: maxPeople != null ? `Max ${maxPeople} người` : '—', icon: <PeopleOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'NGÀY BẮT ĐẦU', value: dash(startStr), icon: <CalendarTodayOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
  ];

  const amenities = services.map(svc => ({
    label: svc.serviceName ?? svc.name ?? '',
    icon: getServiceIcon(svc.serviceName ?? svc.name ?? ''),
  }));

  return (
    <Box sx={{ flex: '0 0 58%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Title & Price Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#1a1a1a' }}>
          {title}
        </Typography>
        {priceStr && (
          <Box
            sx={{
              bgcolor: '#E6F1FB',
              borderRadius: '20px',
              border: '0.5px solid #b3ddf5',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '2px',
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#20a9e7' }}>
              {priceStr}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Address Row */}
      {address && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
          <LocationOnOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7', mr: '6px' }} />
          <Typography sx={{ fontSize: '13px' }}>{address}</Typography>
        </Box>
      )}

      {/* Info Grid Card */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '12px',
          border: '0.5px solid #e5e7eb',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {infoGridCells.map((cell, index) => {
          const isRow1 = index < 3;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderBottom: isRow1 ? '0.5px solid #f0f0f0' : 'none',
                paddingBottom: isRow1 ? '12px' : '0px',
                paddingTop: !isRow1 ? '12px' : '0px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {cell.icon}
                <Typography sx={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, letterSpacing: '0.02em' }}>
                  {cell.label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
                {cell.value}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Amenities Section */}
      {amenities.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', mb: '10px' }}>
            Tiện ích đi kèm
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {amenities.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  bgcolor: '#f5f7fa',
                  border: '0.5px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '5px 12px',
                }}
              >
                {item.icon}
                <Typography sx={{ fontSize: '12px', color: '#374151' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Description Section */}
      {desc && (
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: '12px',
            border: '0.5px solid #e5e7eb',
            padding: '16px',
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', mb: '8px' }}>
            Mô tả chi tiết
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
            {showFullDesc ? desc : truncated}
          </Typography>
          {desc.length > 160 && (
            <Link
              component="button"
              onClick={() => setShowFullDesc(!showFullDesc)}
              sx={{
                fontSize: '13px',
                color: '#20a9e7',
                fontWeight: 500,
                textDecoration: 'none',
                mt: '6px',
                border: 'none',
                bgcolor: 'transparent',
                cursor: 'pointer',
                p: 0,
                fontFamily: 'inherit',
              }}
            >
              {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RoomMainInfo;
