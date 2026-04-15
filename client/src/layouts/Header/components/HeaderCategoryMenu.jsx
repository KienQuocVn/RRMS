import { Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { categoryMenuItems } from './headerData';

export default function HeaderCategoryMenu() {
  return (
    <Box sx={{ position: 'absolute', left: 0, right: 0, zIndex: 1300 }}>
      {/* SVG Magic Triangle */}
      <svg 
        width="723" 
        height="710" 
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <polygon
          points="256,127 406.5374984741211,92 406.5374984741211,284"
          fill="transparent"
          stroke="transparent"
          strokeWidth="0"
        />
      </svg>

      {/* Menu Container */}
      <Box
        sx={{
          position: 'fixed',
          top: '92px',
          left: '170px',
          width: '320px',
          maxHeight: '85vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          zIndex: 189,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {categoryMenuItems.map((item) => (
          <MuiLink
            key={item.label}
            component={Link}
            to={item.to}
            underline="none"
            sx={{
              height: '48px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 12px 10px 12px',
              fontSize: '0.875rem',
              color: '#222222',
              cursor: 'pointer',

              // Hover và Active
              '&:hover': {
                backgroundColor: '#F4F4F4',
              },
              ...(item.active && {
                backgroundColor: '#F4F4F4',
              }),

              // Border bottom giữa các item
              '&:not(:last-child)': {
                boxShadow: 'inset 0px -1px 0px #f4f4f4',
              },

              // Bo góc cho item đầu và cuối khi hover
              '&:first-of-type:hover': {
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
              },
              '&:last-of-type:hover': {
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
              },
            }}
          >
            {/* Nội dung bên trái */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box
                sx={{
                  width: '24px',
                  height: '24px',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box component="span">{item.label}</Box>
            </Box>

            {/* Chevron Icon */}
            {item.hasChevron && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.1949 11.525C5.93598 11.2642 5.93672 10.8432 6.19657 10.5833L8.7799 8L6.19579 5.41026C5.93656 5.15046 5.93679 4.72977 6.19631 4.47026C6.45602 4.21054 6.8771 4.21054 7.13682 4.47026L9.95946 7.29289C10.35 7.68342 10.35 8.31658 9.95946 8.70711L7.1399 11.5267C6.87875 11.7878 6.45512 11.7871 6.1949 11.525Z"
                  fill="#222222"
                />
              </svg>
            )}
          </MuiLink>
        ))}
      </Box>
    </Box>
  );
}