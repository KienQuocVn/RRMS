import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  AlertTitle
} from '@mui/material';
import Swal from 'sweetalert2';
import { getRoomById, updateContractStatus } from '~/apis/roomAPI';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';

function ModalReportContract({ toggleModal, modalOpen, roomId }) {
  const [room, setRoom] = useState({});
  const [dateTerminate, setDateTerminate] = useState('');

  // Hàm format ngày theo định dạng yyyy-mm-dd cho input date của MUI
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hàm format ngày theo định dạng dd-mm-yyyy cho API
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const today = new Date();
    setDateTerminate(formatDateForInput(today));
  }, []);

  const fetchDataRoom = async (id) => {
    if (id) {
      try {
        const response = await getRoomById(id);
        if (response) {
          setRoom(response);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchDataRoom(roomId);
    }
  }, [roomId]);

  const ContractStatus = {
    REPORTEND: 'ReportEnd'
  };

  const handleSubmit = async () => {
    if (roomId && dateTerminate) {
      try {
        const formattedDate = formatDateForAPI(dateTerminate);
        await updateContractStatus(roomId, ContractStatus.REPORTEND, formattedDate);

        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Trạng thái hợp đồng đã được cập nhật thành công.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại!',
          text: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái hợp đồng.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin!',
        text: 'Vui lòng chọn ngày báo kết thúc hợp đồng.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      });
    }
  };

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #eee' }}>
        <Box sx={{
          mr: 2,
          bgcolor: '#20a9e7',
          color: 'white',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ExitToAppIcon />
        </Box>
        Báo kết thúc hợp đồng - {room?.name || '...'}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Ngày báo kết thúc hợp đồng"
            type="date"
            value={dateTerminate}
            onChange={(e) => setDateTerminate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#20a9e7' },
              },
              '& label.Mui-focused': { color: '#20a9e7' }
            }}
          />
        </Box>

        <Alert severity="info" sx={{ mt: 3, '& .MuiAlert-icon': { color: '#20a9e7' } }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Thông tin:</AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 1 } }}>
            <li>Khi khách muốn chuyển đi khách sẽ báo trước ngày chuyển đi. Bạn sẽ ghi nhận ngày để chuẩn bị tìm khách mới.</li>
            <li>Khi phòng/căn hộ/giường ở trạng thái "Đang báo kết thúc" hợp đồng sau hành động này. Khách mới có thể cọc giữ chỗ.</li>
          </Box>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<NotificationsIcon />}
          sx={{
            bgcolor: '#20a9e7',
            '&:hover': { bgcolor: '#1791c8' },
            textTransform: 'none',
            px: 3
          }}
        >
          Báo kết thúc hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalReportContract;
