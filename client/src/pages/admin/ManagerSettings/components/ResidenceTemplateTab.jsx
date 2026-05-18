import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const ResidenceTemplateTab = ({ motel }) => {
  // Mock data for UI showcase, as per design
  const templates = [
    { id: 1, name: 'Bánh mì', motelName: motel?.motelName || 'WEBSITE MỸ PHẨM HÀN QUỐC', sortOrder: 1 },
    { id: 2, name: 'Bánh mì', motelName: 'Bánh Mì', sortOrder: 1 },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Danh sách các mẫu đăng ký tạm trú đang áp dụng</Typography>
          <Typography variant="body2" color="text.secondary">Mẫu được sử dụng khi in dựa trên những thông tin bạn nhập</Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          sx={{ minWidth: 0, width: 48, height: 48, borderRadius: '50%', p: 0, bgcolor: '#20a9e7' }}
        >
          <AddIcon />
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên mẫu tạm trú</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nhà đang áp dụng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Thứ tự sắp xếp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 100, textAlign: 'center' }}>Chỉnh sửa</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 100, textAlign: 'center' }}>Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((tc, i) => (
              <TableRow key={i}>
                <TableCell>{tc.name}</TableCell>
                <TableCell>{tc.motelName}</TableCell>
                <TableCell>{tc.sortOrder}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    sx={{ border: '1px solid #e0e0e0', borderRadius: '50%' }}
                  >
                    <EditOutlinedIcon fontSize="small" sx={{ color: '#555' }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    sx={{ border: '1px solid #f8bbd0', bgcolor: '#ffebee', borderRadius: '50%', color: '#d32f2f', '&:hover': { bgcolor: '#ffcdd2' } }}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ResidenceTemplateTab;
