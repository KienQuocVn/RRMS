import React from 'react';
import { Box, Typography, Grid, Paper, Button, IconButton } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const InfoCard = ({ label, value, hasCopy, valueColor }) => (
  <Paper elevation={0} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2, height: '100%' }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body1" fontWeight="bold" color={valueColor || 'text.primary'}>
        {value}
      </Typography>
      {hasCopy && (
        <IconButton size="small" sx={{ bgcolor: '#f0f8ff', color: '#1976d2', p: 0.5 }}>
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  </Paper>
);

const AccountInfoTab = ({ account }) => {
  const uid = account.uid || '#260W00013509';
  const phone = account.phone || '0913126826';
  const email = account.email || 'Chưa cập nhật';
  const isVerified = account.isVerified || false;
  const createdAt = account.createdAt || '15/04/2026';
  const firstLogin = account.firstLogin || '';
  const totalDays = account.totalDays || '33';

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            <PersonOutlineIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">Thông tin tài khoản</Typography>
            <Typography variant="body2" color="text.secondary">
              Thông tin cơ bản của chủ nhà, trạng thái tài khoản và các mốc sử dụng chính.
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<EditOutlinedIcon />}
          sx={{ borderRadius: 20, textTransform: 'none', bgcolor: '#20a9e7' }}
        >
          Chỉnh sửa tài khoản
        </Button>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoCard label="Mã tài khoản" value={uid} hasCopy />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard 
            label="Tình trạng" 
            value={isVerified ? "Đã được xác minh" : "Chưa được xác minh"} 
            valueColor={isVerified ? "success.main" : "warning.main"} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Số điện thoại" value={phone} hasCopy />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Email" value={email} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Ngày tạo tài khoản" value={createdAt} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Ngày đăng nhập lần đầu" value={firstLogin} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Tổng số ngày sử dụng" value={totalDays} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Hợp đồng thuê phần mềm</Typography>
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              startIcon={<DescriptionOutlinedIcon />}
              sx={{ borderRadius: 20, textTransform: 'none', bgcolor: '#20a9e7' }}
            >
              Xem mẫu
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountInfoTab;
