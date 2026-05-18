import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { index: 0, label: 'Thông tin đại diện cho hợp đồng', icon: <PersonOutlineIcon /> },
    { index: 1, label: 'Cài đặt mẫu văn bản hợp đồng', icon: <DescriptionOutlinedIcon /> },
    { index: 2, label: 'Cài đặt mẫu tờ khai tạm trú', icon: <ReceiptLongOutlinedIcon /> },
  ];

  return (
    <Paper elevation={0} sx={{ width: '100%', borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
      <List disablePadding>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.index;
          return (
            <ListItem disablePadding key={tab.index} sx={{ borderBottom: tab.index < 2 ? '1px solid #f0f0f0' : 'none' }}>
              <ListItemButton
                selected={isActive}
                onClick={() => setActiveTab(tab.index)}
                sx={{
                  py: 2,
                  px: 3,
                  bgcolor: isActive ? '#20a9e7' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&.Mui-selected': {
                    bgcolor: '#20a9e7',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#2b7ed7',
                    }
                  },
                  '&:hover': {
                    bgcolor: isActive ? '#2b7ed7' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {tab.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tab.label} 
                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default SettingsSidebar;
