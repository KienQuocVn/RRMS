import React from 'react';
import { Box, Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';

const AccountTabs = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, bgcolor: 'white', p: 1, borderRadius: 3, mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Button
        variant={activeTab === 0 ? "contained" : "text"}
        color="success"
        startIcon={<PersonOutlineIcon />}
        onClick={() => setActiveTab(0)}
        sx={{
          borderRadius: 20,
          textTransform: 'none',
          px: 3,
          py: 1,
          bgcolor: activeTab === 0 ? '#20a9e7' : 'transparent',
          color: activeTab === 0 ? 'white' : 'text.secondary',
          fontWeight: activeTab === 0 ? 'bold' : 'normal',
          '&:hover': {
            bgcolor: activeTab === 0 ? '#20a9e7' : 'rgba(0,0,0,0.04)',
          }
        }}
      >
        Thông tin tài khoản
      </Button>
      <Button
        variant={activeTab === 1 ? "contained" : "text"}
        color="success"
        startIcon={<DesktopWindowsOutlinedIcon />}
        onClick={() => setActiveTab(1)}
        sx={{
          borderRadius: 20,
          textTransform: 'none',
          px: 3,
          py: 1,
          bgcolor: activeTab === 1 ? '#20a9e7' : 'transparent',
          color: activeTab === 1 ? 'white' : 'text.secondary',
          fontWeight: activeTab === 1 ? 'bold' : 'normal',
          '&:hover': {
            bgcolor: activeTab === 1 ? '#20a9e7' : 'rgba(0,0,0,0.04)',
          }
        }}
      >
        Thiết bị đăng nhập
      </Button>
    </Box>
  );
};

export default AccountTabs;
