import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Popover
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const PRIMARY_COLOR = '#20a9e7';

const MONTH_LABELS = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

// Format tiền VN
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '?';
  return `${Number(value).toLocaleString('vi-VN')} đ`;
};

// MonthPicker Component
const MonthPicker = ({ selectedMonth, setSelectedMonth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pickerYear, setPickerYear] = useState(selectedMonth.year);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setPickerYear(selectedMonth.year);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectMonth = (month) => {
    setSelectedMonth({ month, year: pickerYear });
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          border: '1.5px solid #d0d5dd',
          borderRadius: '8px',
          px: 1.5,
          py: 0.5,
          cursor: 'pointer',
          minWidth: 150,
          height: 48,
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: PRIMARY_COLOR },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: '#777', fontSize: '0.7rem', lineHeight: 1, display: 'block' }}>
            Tháng lập phiếu
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>
            {String(selectedMonth.month).padStart(2, '0')}/{selectedMonth.year}
          </Typography>
        </Box>
        <CalendarTodayOutlinedIcon sx={{ color: '#555', fontSize: '1.2rem', ml: 1 }} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #e8e8e8',
              mt: 1,
              width: 280,
            }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Year navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <IconButton
              size="small"
              onClick={() => setPickerYear(y => y - 1)}
              sx={{ color: '#555' }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#333' }}>
              {pickerYear}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setPickerYear(y => y + 1)}
              sx={{ color: '#555' }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Month grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {MONTH_LABELS.map((label, index) => {
              const monthNum = index + 1;
              const isSelected = selectedMonth.month === monthNum && selectedMonth.year === pickerYear;

              return (
                <Button
                  key={monthNum}
                  onClick={() => handleSelectMonth(monthNum)}
                  variant={isSelected ? 'contained' : 'text'}
                  sx={{
                    minWidth: 0,
                    py: 1,
                    px: 0.5,
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#fff' : '#555',
                    backgroundColor: isSelected ? PRIMARY_COLOR : 'transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? '#1792ca' : '#f0f7ff',
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

const UsageReport = ({ roomData, motelServices, selectedMonth, setSelectedMonth }) => {
  // Tính toán số lượng dịch vụ cho colspan
  const serviceCount = motelServices?.length || 0;

  // Format tên đơn vị dịch vụ cho header
  const getServiceHeader = (service) => {
    const chargeMap = {
      'nguoi': '(Người)',
      'thang': '(Tháng)',
      'kwh': '(kWh)',
      'khoi': '(Khối)',
      'chiec': '(Chiếc)',
      'lan': '(Lần)',
      'cai': '(Cái)',
      'fixed': '(Tháng)',
      'FIXED': '(Tháng)',
      'meter': '(Chỉ số)',
      'METER': '(Chỉ số)',
    };

    let chargetype = service.chargetype;

    // Đoán đơn vị dựa trên tên dịch vụ nếu chargetype là METER hoặc FIXED
    if (chargetype === 'METER' || chargetype === 'meter') {
      const name = service.nameService?.toLowerCase() || '';
      if (name.includes('điện')) {
        chargetype = 'kwh';
      } else if (name.includes('nước')) {
        chargetype = 'khoi';
      }
    } else if (chargetype === 'FIXED' || chargetype === 'fixed') {
      const name = service.nameService?.toLowerCase() || '';
      if (name.includes('người')) {
        chargetype = 'nguoi';
      } else {
        chargetype = 'thang';
      }
    }

    const unit = chargeMap[chargetype] || `(${chargetype})`;
    return `${service.nameService} ${unit}`;
  };

  const handleExportExcel = () => {
    if (roomData.length === 0) {
      Swal.fire('Thông báo', 'Không có dữ liệu sử dụng dịch vụ để xuất', 'info');
      return;
    }

    const excelData = roomData.map((room) => {
      const rowData = {
        'Tên phòng': room.nameRoom
      };

      motelServices.forEach((service) => {
        const usageKey = `usage_${service.motelServiceId}`;
        const totalKey = `total_${service.motelServiceId}`;
        
        let unitLabel = '';
        const name = service.nameService?.toLowerCase() || '';
        let chargetype = service.chargetype;

        if (chargetype === 'METER' || chargetype === 'meter') {
          if (name.includes('điện')) chargetype = 'kwh';
          else if (name.includes('nước')) chargetype = 'khoi';
        } else if (chargetype === 'FIXED' || chargetype === 'fixed') {
          if (name.includes('người')) chargetype = 'nguoi';
          else chargetype = 'thang';
        }

        const chargeMap = {
          'nguoi': 'Người',
          'thang': 'Tháng',
          'kwh': 'kWh',
          'khoi': 'Khối',
          'chiec': 'Chiếc',
          'lan': 'Lần',
          'cai': 'Cái'
        };
        unitLabel = chargeMap[chargetype] || chargetype;
        
        rowData[`${service.nameService} - Sử dụng (${unitLabel})`] = room[usageKey] !== undefined ? room[usageKey] : '?';
        rowData[`${service.nameService} - Thành tiền (đ)`] = room[totalKey] !== undefined ? room[totalKey] : '?';
      });

      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoSuDungDichVu');

    const fileName = `BaoCaoSuDungDichVu_${String(selectedMonth.month).padStart(2, '0')}_${selectedMonth.year}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    Swal.fire('Thành công!', `Đã xuất file excel ${fileName}`, 'success');
  };

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
          <MonthPicker selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

          <Button
            id="download-excel"
            variant="contained"
            onClick={handleExportExcel}
            startIcon={<InsertDriveFileOutlinedIcon />}
            sx={{
              backgroundColor: '#20a9e7',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              height: 48,
              boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
              '&:hover': { backgroundColor: '#2b7ed7' },
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
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small" sx={{ minWidth: 600 }}>
            {/* ===== TABLE HEADER ===== */}
            <TableHead>
              {/* Row 1: Grouped headers */}
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '0.85rem',
                    borderRight: '1px solid #e0e0e0',
                    borderBottom: '2px solid #e0e0e0',
                    textAlign: 'center',
                    minWidth: 120,
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                  }}
                >
                  Tên phòng
                </TableCell>

                {motelServices.map((service) => (
                  <TableCell
                    key={service.motelServiceId}
                    colSpan={2}
                    align="center"
                    sx={{
                      backgroundColor: '#f8f9fa',
                      fontWeight: 700,
                      color: '#333',
                      fontSize: '0.82rem',
                      borderRight: '1px solid #e0e0e0',
                      borderBottom: '1px solid #e0e0e0',
                      whiteSpace: 'nowrap',
                      py: 1,
                    }}
                  >
                    {getServiceHeader(service)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 2: Sub-headers (Sử dụng / Thành tiền) */}
              <TableRow>
                {motelServices.map((service) => (
                  <React.Fragment key={`sub-${service.motelServiceId}`}>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#555',
                        fontSize: '0.78rem',
                        borderRight: '1px solid #eee',
                        borderBottom: '2px solid #e0e0e0',
                        py: 0.75,
                        minWidth: 65,
                      }}
                    >
                      Sử dụng
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        color: '#555',
                        fontSize: '0.78rem',
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '2px solid #e0e0e0',
                        py: 0.75,
                        minWidth: 90,
                      }}
                    >
                      Thành tiền
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>

            {/* ===== TABLE BODY ===== */}
            <TableBody>
              {roomData.length > 0 ? (
                roomData.map((room, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
                      '&:hover': { backgroundColor: '#f0f7ff' },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        fontSize: '0.85rem',
                        borderRight: '1px solid #e0e0e0',
                        textAlign: 'center',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
                        zIndex: 1,
                      }}
                    >
                      {room.nameRoom}
                    </TableCell>

                    {motelServices.map((service) => {
                      const usageKey = `usage_${service.motelServiceId}`;
                      const totalKey = `total_${service.motelServiceId}`;
                      const usage = room[usageKey];
                      const total = room[totalKey];
                      const hasData = usage !== undefined && usage !== null;

                      return (
                        <React.Fragment key={`data-${service.motelServiceId}`}>
                          <TableCell
                            align="center"
                            sx={{
                              fontSize: '0.85rem',
                              color: hasData ? '#333' : '#999',
                              fontStyle: hasData ? 'normal' : 'italic',
                              borderRight: '1px solid #eee',
                              py: 1.2,
                            }}
                          >
                            {hasData ? usage : '?'}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontSize: '0.85rem',
                              color: hasData ? '#333' : '#e53935',
                              fontWeight: hasData ? 500 : 400,
                              fontStyle: hasData ? 'normal' : 'italic',
                              borderRight: '1px solid #e0e0e0',
                              py: 1.2,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {hasData ? formatCurrency(total) : '?'}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={1 + serviceCount * 2}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fempty-box-4085812-3385481.webp?alt=media&token=eaf37b59-00e3-4d16-8463-5441f54fb60e"
                        alt="Không có dữ liệu"
                        style={{ width: 120, marginBottom: 16, opacity: 0.8 }}
                      />
                      <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic', fontWeight: 600 }}>
                        Không tìm thấy dữ liệu!
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UsageReport;
