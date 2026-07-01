import React from 'react';
import { Box, Button } from '@mui/material';

const buttonStyle = (isActive) => ({
  minWidth: '32px',
  width: '32px',
  height: '32px',
  padding: 0,
  borderRadius: '6px',
  border: isActive ? 'none' : '0.5px solid #e5e7eb',
  bgcolor: isActive ? '#20a9e7' : '#ffffff',
  color: isActive ? '#ffffff' : '#6b7280',
  fontSize: '13px',
  fontWeight: isActive ? 600 : 500,
  textTransform: 'none',
  fontFamily: 'inherit',
  '&:hover': {
    bgcolor: isActive ? '#2b7ed7' : '#f0f9ff',
    borderColor: isActive ? 'none' : '#20a9e7',
    color: isActive ? '#ffffff' : '#20a9e7',
  },
});

const PaginationBar = ({ currentPage = 1, onPageChange }) => {
  return (
    <Box
      sx={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {/* Prev */}
      <Button
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          ...buttonStyle(false),
          '&.Mui-disabled': {
            borderColor: '#e5e7eb',
            color: '#d1d5db',
          },
        }}
      >
        ‹
      </Button>

      {/* Page 1 */}
      <Button
        onClick={() => onPageChange && onPageChange(1)}
        sx={buttonStyle(currentPage === 1)}
      >
        1
      </Button>

      {/* Page 2 */}
      <Button
        onClick={() => onPageChange && onPageChange(2)}
        sx={buttonStyle(currentPage === 2)}
      >
        2
      </Button>

      {/* Next */}
      <Button
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        disabled={currentPage === 2}
        sx={{
          ...buttonStyle(false),
          '&.Mui-disabled': {
            borderColor: '#e5e7eb',
            color: '#d1d5db',
          },
        }}
      >
        ›
      </Button>
    </Box>
  );
};

export default PaginationBar;
