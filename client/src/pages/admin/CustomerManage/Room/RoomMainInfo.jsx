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

const RoomMainInfo = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const fullDescription = "Phòng trọ cao cấp tọa lạc tại vị trí đắc địa ngay trung tâm Quận 1. Không gian sống được thiết kế thông minh, tối ưu hóa diện tích với ánh sáng tự nhiên ngập tràn. Được trang bị đầy đủ nội thất hiện đại nhập khẩu bao gồm hệ thống điều hòa thế hệ mới, tủ lạnh thông minh, giường đệm cao cấp. An ninh đảm bảo tuyệt đối 24/7 với camera giám sát, khóa vân tay tiện lợi và chỗ đậu xe rộng rãi. Phù hợp cho người đi làm hoặc sinh viên muốn tìm kiếm không gian sinh hoạt yên tĩnh, văn minh.";

  const truncatedDescription = "Phòng trọ cao cấp tọa lạc tại vị trí đắc địa ngay trung tâm Quận 1. Không gian sống được thiết kế thông minh, tối ưu hóa diện tích với ánh sáng tự nhiên ngập tràn...";

  const infoGridCells = [
    { label: 'DIỆN TÍCH', value: '25 m²', icon: <AspectRatioOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'TẦNG', value: 'Tầng 1', icon: <LayersOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'HƯỚNG', value: 'Đông Nam', icon: <ExploreOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'LOẠI PHÒNG', value: 'Studio', icon: <HomeOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'SỐ NGƯỜI', value: 'Max 2 người', icon: <PeopleOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
    { label: 'NGÀY BẮT ĐẦU', value: '01/05/2024', icon: <CalendarTodayOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7' }} /> },
  ];

  const amenities = [
    { label: 'Wifi miễn phí', icon: <WifiIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
    { label: 'Điều hòa', icon: <AcUnitOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
    { label: 'Máy nước nóng', icon: <OpacityOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
    { label: 'Tủ lạnh', icon: <KitchenOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
    { label: 'Bảo vệ', icon: <SecurityOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
    { label: 'Chỗ để xe', icon: <LocalParkingOutlinedIcon sx={{ fontSize: '13px', color: '#20a9e7' }} /> },
  ];

  return (
    <Box sx={{ flex: '0 0 58%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Title & Price Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#1a1a1a' }}>
          Phòng 102
        </Typography>
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
          <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#20a9e7' }}>
            3.5M
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
            /tháng
          </Typography>
        </Box>
      </Box>

      {/* Address Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
        <LocationOnOutlinedIcon sx={{ fontSize: '14px', color: '#20a9e7', mr: '6px' }} />
        <Typography sx={{ fontSize: '13px' }}>
          123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
        </Typography>
      </Box>

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

      {/* Description Section */}
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
          {showFullDesc ? fullDescription : truncatedDescription}
        </Typography>
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
      </Box>

    </Box>
  );
};

export default RoomMainInfo;
