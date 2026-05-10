import React from 'react';
import { Box, Typography, IconButton, Paper, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const PRIMARY_COLOR = '#20a9e7';

const ServiceList = ({ motelServices, openEditModal, deleteMotelService }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ borderLeft: `4px solid ${PRIMARY_COLOR}`, pl: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
            Quản lý dịch vụ
          </Typography>
          <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Các dịch vụ khách thuê xài
          </Typography>
        </Box>
        <IconButton
          data-bs-toggle="modal"
          data-bs-target="#addPriceItem"
          sx={{
            backgroundColor: PRIMARY_COLOR,
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': { backgroundColor: '#1792ca' },
            boxShadow: '0 4px 10px rgba(32, 169, 231, 0.3)',
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {motelServices.length > 0 ? (
          motelServices.map((service) => (
            <Paper
              key={service.motelServiceId}
              elevation={0}
              sx={{
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: PRIMARY_COLOR,
                  boxShadow: '0 4px 12px rgba(32, 169, 231, 0.1)',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#f5f7fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #eee',
                }}
              >
                <LocalOfferOutlinedIcon sx={{ color: '#555', fontSize: '1.5rem', transform: 'rotate(90deg)' }} />
              </Box>

              {/* Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#333', fontSize: '0.95rem', mb: 0.5 }}>
                  {service.nameService}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontWeight: 600, fontSize: '0.85rem' }}>
                  {service.price.toLocaleString('vi-VN')}đ/ {service.chargetype}
                </Typography>
                {service.count > 0 ? (
                  <Typography variant="caption" sx={{ color: '#43a047', fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                    Đang áp dụng cho {service.count} phòng
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: '#e53935', fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                    Không áp dụng cho phòng nào
                  </Typography>
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <IconButton
                  onClick={() => openEditModal(service)}
                  data-bs-toggle="modal"
                  data-bs-target="#updateModelService"
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#f5f7fa',
                    border: '1px solid #ddd',
                    color: '#555',
                    '&:hover': { backgroundColor: '#eef2f6', color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
                <IconButton
                  onClick={() => deleteMotelService(service.motelServiceId)}
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#fff1f0',
                    border: '1px solid #ffccc7',
                    color: '#ff4d4f',
                    '&:hover': { backgroundColor: '#ffccc7' },
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic' }}>
            Chưa có dịch vụ nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ServiceList;
