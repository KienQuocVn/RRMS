import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

const LoginDevicesTab = () => {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: '#f3e5f5', color: '#9c27b0', p: 1.5, borderRadius: '50%', display: 'flex' }}>
          <DesktopWindowsOutlinedIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">Thiết bị đăng nhập</Typography>
          <Typography variant="body2" color="text.secondary">
            Danh sách các thiết bị đã đăng nhập vào tài khoản của bạn.
          </Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hệ điều hành</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mẫu thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phiên bản</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày đăng nhập</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoginDevicesTab;
