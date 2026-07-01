import React from 'react';
import { Box } from '@mui/material';
import PhotoGallery from './PhotoGallery';
import RoomMainInfo from './RoomMainInfo';
import RightSidebarInfo from './RightSidebarInfo';

const RoomDetail = () => {
  return (
    <Box sx={{ padding: '20px', bgcolor: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Photo Gallery */}
      <PhotoGallery />

      {/* Block 2 — Info columns */}
      <Box
        sx={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column (58% width on desktop) */}
        <RoomMainInfo />

        {/* Right Column (40% width on desktop) */}
        <RightSidebarInfo />
      </Box>
    </Box>
  );
};

export default RoomDetail;
