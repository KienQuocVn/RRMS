import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const PhotoGallery = ({ photos = [] }) => {
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=cover&w=800&q=80', // Phòng ngủ chính
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=cover&w=400&q=80', // Nhà vệ sinh
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=cover&w=400&q=80', // Ban công
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=cover&w=400&q=80', // Nhà bếp
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  const handlePhotoClick = (index) => {
    alert(`Mở ảnh lớn thứ ${index + 1} ở chế độ Fullscreen Lightbox`);
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
          src={displayPhotos[0]}
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
            src={displayPhotos[1]}
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
              src={displayPhotos[2]}
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
              src={displayPhotos[3]}
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
                5 ảnh
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PhotoGallery;
