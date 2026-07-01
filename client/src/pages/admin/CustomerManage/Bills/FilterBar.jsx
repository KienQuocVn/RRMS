import React from 'react';
import { Box, MenuItem, Select, Typography, Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const FilterBar = ({ year, setYear, status, setStatus, onExportExcel }) => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#ffffff',
        borderRadius: '10px',
        padding: '12px 16px',
        border: '0.5px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Năm */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Năm</Typography>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{
            bgcolor: '#ffffff',
            height: '32px',
            fontSize: '13px',
            minWidth: '80px',
            borderRadius: '6px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e5e7eb',
              borderWidth: '0.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#20a9e7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#20a9e7',
            },
            '& .MuiSelect-select': {
              padding: '5px 12px',
            },
          }}
        >
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
        </Select>
      </Box>

      {/* Trạng thái */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Typography sx={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Trạng thái</Typography>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            bgcolor: '#ffffff',
            height: '32px',
            fontSize: '13px',
            minWidth: '160px',
            borderRadius: '6px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e5e7eb',
              borderWidth: '0.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#20a9e7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#20a9e7',
            },
            '& .MuiSelect-select': {
              padding: '5px 12px',
            },
          }}
        >
          <MenuItem value="all">Tất cả trạng thái</MenuItem>
          <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
          <MenuItem value="paid">Đã thanh toán</MenuItem>
          <MenuItem value="overdue">Quá hạn</MenuItem>
        </Select>
      </Box>

      {/* Xuất báo cáo */}
      <Button
        onClick={onExportExcel}
        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={{
          marginLeft: 'auto',
          fontSize: '13px',
          fontWeight: 500,
          color: '#20a9e7',
          border: '0.5px solid #20a9e7',
          borderRadius: '8px',
          padding: '5px 16px',
          textTransform: 'none',
          bgcolor: '#ffffff',
          '&:hover': {
            bgcolor: '#f0f9ff',
            borderColor: '#2b7ed7',
          },
        }}
      >
        Xuất báo cáo (Excel)
      </Button>
    </Box>
  );
};

export default FilterBar;
