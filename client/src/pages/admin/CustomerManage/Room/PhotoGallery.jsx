import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const PhotoGallery = ({ photos = [] }) => {
  const displayPhotos = photos.filter(Boolean);

  // Không có ảnh nào → hiện empty state
  if (displayPhotos.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '260px',
          borderRadius: '12px',
          bgcolor: '#f0f2f5',
          border: '0.5px dashed #d1d5db',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <ImageOutlinedIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
        <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>Chưa có ảnh phòng</Typography>
      </Box>
    );
  }

  // Pad mảng đến 4 phần tử nếu thiếu (dùng ảnh đầu làm fallback)
  const padded = [...displayPhotos];
  while (padded.length < 4) padded.push(displayPhotos[0]);

  const handlePhotoClick = (index) => {
    window.open(padded[index], '_blank');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '260px',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '4px',
      }}
    >
      {/* Left Cell (spans 2 rows equivalent because height is 260px) */}
      <Box
        onClick={() => handlePhotoClick(0)}
        sx={{
          height: '260px',
          cursor: 'pointer',
          '&:hover': { opacity: 0.95 },
          transition: 'opacity 0.2s',
        }}
      >
        <Box
          component="img"
          src={padded[0]}
          alt="Main Room Photo"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Column (2 rows stacked) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '260px' }}>
        {/* Top-Right Cell */}
        <Box
          onClick={() => handlePhotoClick(1)}
          sx={{
            height: '128px',
            cursor: 'pointer',
            '&:hover': { opacity: 0.95 },
            transition: 'opacity 0.2s',
          }}
        >
          <Box
            component="img"
            src={padded[1]}
            alt="Second Room Photo"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Bottom-Right Cell */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            height: '128px',
          }}
        >
          {/* Photo 3 */}
          <Box
            onClick={() => handlePhotoClick(2)}
            sx={{
              height: '128px',
              cursor: 'pointer',
              '&:hover': { opacity: 0.95 },
              transition: 'opacity 0.2s',
            }}
          >
            <Box
              component="img"
              src={padded[2]}
              alt="Third Room Photo"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>

          {/* Photo 4 (Overlay badge on top) */}
          <Box
            onClick={() => handlePhotoClick(3)}
            sx={{
              height: '128px',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': { opacity: 0.95 },
              transition: 'opacity 0.2s',
            }}
          >
            <Box
              component="img"
              src={padded[3]}
              alt="Fourth Room Photo"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Dark Overlay Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <ImageOutlinedIcon sx={{ color: '#ffffff', fontSize: '15px' }} />
              <Typography sx={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                {displayPhotos.length > 4 ? `+${displayPhotos.length - 3} ảnh` : `${displayPhotos.length} ảnh`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PhotoGallery;
