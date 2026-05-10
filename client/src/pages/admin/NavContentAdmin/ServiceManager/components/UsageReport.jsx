import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import Flatpickr from 'react-flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { ReactTabulator } from 'react-tabulator';
import EmptyInvoiceState from '../../InvoiceManager/components/EmptyInvoiceState'; // Reusing empty state if applicable, or I can use the existing image logic

const PRIMARY_COLOR = '#20a9e7';

const UsageReport = ({ roomData, columns, options }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ borderLeft: `4px solid ${PRIMARY_COLOR}`, pl: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
            Báo cáo khách sử dụng
          </Typography>
          <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Thống kê mỗi tháng khách thuê xài
          </Typography>
        </Box>

        {/* Filters and Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '8px',
              px: 1.5,
              height: 40,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
              <Typography variant="caption" sx={{ color: '#777', fontSize: '0.7rem', lineHeight: 1 }}>
                Tháng lập phiếu
              </Typography>
              <Flatpickr
                className="flatpickr-input"
                name="month"
                id="month"
                placeholder="Chọn tháng"
                options={{
                  locale: Vietnamese,
                  plugins: [
                    new monthSelectPlugin({
                      shorthand: true,
                      dateFormat: 'm/Y',
                    }),
                  ],
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  padding: 0,
                  width: '70px',
                }}
              />
            </Box>
            <CalendarTodayOutlinedIcon sx={{ color: '#777', fontSize: '1.2rem' }} />
          </Box>

          <Button
            id="download-excel"
            variant="contained"
            startIcon={<InsertDriveFileOutlinedIcon />}
            sx={{
              backgroundColor: '#43a047',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              height: 40,
              boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
              '&:hover': { backgroundColor: '#388e3c' },
            }}
          >
            Xuất excel
          </Button>
        </Box>
      </Box>

      {/* Table Area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          '& .tabulator': {
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.85rem',
          },
          '& .tabulator .tabulator-header': {
            backgroundColor: '#f8f9fa',
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
          },
          '& .tabulator .tabulator-header .tabulator-col': {
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontWeight: 700,
            borderRight: '1px solid #eee',
          },
          '& .tabulator-row': {
            borderBottom: '1px solid #eee',
          },
          '& .tabulator-row.tabulator-row-even': {
            backgroundColor: '#fafafa',
          },
          '& .tabulator-cell': {
            borderRight: '1px solid #eee',
            padding: '10px 8px',
            color: '#444',
          },
          '& .custom-placeholder': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          },
          '& .placeholder-image': {
            width: '120px',
            marginBottom: '16px',
            opacity: 0.8,
          },
          '& .placeholder-text': {
            color: '#999',
            fontStyle: 'italic',
            fontWeight: 600,
          },
        }}
      >
        <Box sx={{ height: '100%', overflowX: 'auto', p: 0 }}>
          <ReactTabulator
            className="my-custom-table"
            columns={columns}
            data={roomData.length > 0 ? roomData : []}
            options={{ ...options, responsiveLayout: roomData.length > 0 ? 'collapse' : false }}
            placeholder={
              <div className="custom-placeholder">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fempty-box-4085812-3385481.webp?alt=media&token=eaf37b59-00e3-4d16-8463-5441f54fb60e"
                  alt="Không có dữ liệu"
                  className="placeholder-image"
                />
                <div className="placeholder-text">Không tìm thấy dữ liệu!</div>
              </div>
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default UsageReport;
