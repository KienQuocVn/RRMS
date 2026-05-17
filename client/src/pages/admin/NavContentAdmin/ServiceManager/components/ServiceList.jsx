import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
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
            backgroundColor: '#20a9e7',
            color: '#fff',
            width: 36,
            height: 36,
            '&:hover': { backgroundColor: '#2b7ed7' },
            boxShadow: '0 3px 8px rgba(67,160,71,0.3)',
          }}
        >
          <AddIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {motelServices.length > 0 ? (
          motelServices.map((service) => (
            <Paper
              key={service.motelServiceId}
              elevation={0}
              sx={{
                border: '1px solid #eaeaea',
                borderRadius: '10px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: PRIMARY_COLOR,
                  boxShadow: '0 3px 10px rgba(32, 169, 231, 0.1)',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: '#f5f7fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #eee',
                }}
              >
                <LocalOfferOutlinedIcon sx={{ color: '#555', fontSize: '1.3rem', transform: 'rotate(90deg)' }} />
              </Box>

              {/* Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', mb: 0.25, lineHeight: 1.3 }}>
                  {service.nameService}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontWeight: 600, fontSize: '0.82rem' }}>
                  {service.price?.toLocaleString('vi-VN')}đ/ {service.chargetype === 'nguoi' ? 'Người' : service.chargetype === 'thang' ? 'Tháng' : service.chargetype}
                </Typography>
                {service.count > 0 ? (
                  <Typography variant="caption" sx={{ color: '#43a047', fontStyle: 'italic', display: 'block', mt: 0.25, fontSize: '0.75rem' }}>
                    Đang áp dụng cho {service.count} phòng
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: '#e53935', fontStyle: 'italic', display: 'block', mt: 0.25, fontSize: '0.75rem' }}>
                    Không áp dụng cho phòng nào
                  </Typography>
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
                <IconButton
                  onClick={() => openEditModal(service)}
                  data-bs-toggle="modal"
                  data-bs-target="#updateModelService"
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#f5f7fa',
                    border: '1px solid #ddd',
                    color: '#555',
                    '&:hover': { backgroundColor: '#eef2f6', color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
                <IconButton
                  onClick={() => deleteMotelService(service.motelServiceId)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#fff1f0',
                    border: '1px solid #ffccc7',
                    color: '#ff4d4f',
                    '&:hover': { backgroundColor: '#ffccc7' },
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: '1rem' }} />
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
