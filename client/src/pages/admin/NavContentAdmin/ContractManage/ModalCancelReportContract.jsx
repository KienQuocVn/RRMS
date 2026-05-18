import{ useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  AlertTitle
} from '@mui/material';
import Swal from 'sweetalert2';
import { getRoomById, updateContractStatus } from '~/apis/roomAPI';
import { getContractByIdRoom2 } from '~/apis/contractTemplateAPI';
import EventIcon from '@mui/icons-material/Event';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function ModalCancelReportContract({ toggleModal, modalOpen, roomId }) {
  const [room, setRoom] = useState({});
  const [contract, setContract] = useState({});

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

  const fetchDataContract = async (id) => {
    if (id) {
      try {
        const response = await getContractByIdRoom2(id);
        if (response) {
          setContract(response);
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
      }
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '...';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (roomId) {
      fetchDataRoom(roomId);
      fetchDataContract(roomId);
    }
  }, [roomId]);

  const ContractStatus = {
    ACTIVE: 'ACTIVE'
  };

  const handleSubmit = async () => {
    if (roomId) {
      try {
        await updateContractStatus(roomId, ContractStatus.ACTIVE, null);

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
          <EventIcon />
        </Box>
        Hủy báo kết thúc hợp đồng - {room?.name || '...'}
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Alert
          severity="warning"
          icon={<WarningAmberIcon sx={{ color: '#ff9800' }} />}
          sx={{
            mt: 2,
            bgcolor: '#fff3e0',
            border: '1px solid #ffe0b2',
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>Cảnh báo:</AlertTitle>
          <Typography variant="body1">
            Khách thuê đã báo kết thúc hợp đồng vào{' '}
            <Box component="span" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
              {formatDate(contract?.reportcloseContract)}
            </Box>{' '}
            trước đó.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Hiện khách thuê vẫn muốn tiếp tục thuê nên bạn muốn hủy báo kết thúc hợp đồng?
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#20a9e7',
            '&:hover': { bgcolor: '#1791c8' },
            textTransform: 'none',
            px: 3
          }}
        >
          Hủy báo kết thúc hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalCancelReportContract;
