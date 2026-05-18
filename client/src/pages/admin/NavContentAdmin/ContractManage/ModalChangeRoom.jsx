import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardActionArea,
  CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { getRoomById, getRoomByMotelIdWContract } from '~/apis/roomAPI';
import { getContractByIdRoom2, updateContractDetail } from '~/apis/contractTemplateAPI';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function ModalChangeRoom({ toggleModal, modalOpen, roomId }) {
  const { motelId } = useParams();
  const [room, setRoom] = useState({});
  const [roomSelect, setRoomSelect] = useState(null);
  const [contract, setContract] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDataRoom = async (roomId) => {
    if (roomId) {
      try {
        const response = await getRoomById(roomId);
        if (response) {
          setRoom(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchRooms = async () => {
    if (motelId) {
      setLoading(true);
      try {
        const dataRoom = await getRoomByMotelIdWContract(motelId);
        setRooms(dataRoom || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoomClick = async (clickedRoomId) => {
    setSelectedRoomId(clickedRoomId === selectedRoomId ? null : clickedRoomId);
    if (clickedRoomId === selectedRoomId) {
      setRoomSelect(null);
      return;
    }
    if (clickedRoomId) {
      try {
        const dataRoom = await getRoomById(clickedRoomId);
        setRoomSelect(dataRoom);
        setContract((prevContract) => ({
          ...prevContract,
          roomId: dataRoom.roomId,
          price: dataRoom.price,
          deposit: dataRoom.price
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      setRoomSelect(null);
      setContract((prevContract) => ({
        ...prevContract,
        room: null
      }));
    }
  };

  const fetchDataContract = async (roomId) => {
    if (roomId) {
      try {
        const response = await getContractByIdRoom2(roomId);
        if (response) {
          setContract(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const handlFristData = () => {
      if (roomId && motelId) {
        fetchDataRoom(roomId);
        fetchDataContract(roomId);
        fetchRooms();
      }
    };
    if (modalOpen) {
      handlFristData();
    }
  }, [roomId, motelId, modalOpen]);

  const handleSubmit = async () => {
    if (roomId) {
      try {
        if (roomSelect && contract) {
          await updateContractDetail(contract.contractId, roomSelect.roomId, roomSelect.price, roomSelect.price, 0.0);
          Swal.fire({
            icon: 'success',
            title: 'Chuyển phòng thành công!',
            text: 'Bạn đã chuyển phòng thành công.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#20a9e7'
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Chuyển phòng thất bại!',
            text: 'Vui lòng chọn phòng để chuyển.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#20a9e7'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Chuyển phòng thất bại!',
          text: error.message || 'Có lỗi xảy ra khi chuyển phòng.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#20a9e7'
        });
      }
    }
  };

  if (!room || !contract) return null;

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', color: '#333', display: 'flex', alignItems: 'center', pb: 2 }}>
        <Box sx={{
          mr: 2,
          bgcolor: '#20a9e7',
          color: 'white',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(32, 169, 231, 0.3)'
        }}>
          <FormatListBulletedIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>Danh sách phòng</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Chọn phòng để chuyển - {room?.name || 'Không có thông tin'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3, bgcolor: '#f9fafc' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress sx={{ color: '#20a9e7' }} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {rooms.length > 0 ? (
              rooms.map((r) => (
                <Grid item xs={12} sm={6} key={r.roomId}>
                  <Card 
                    sx={{ 
                      borderRadius: 2, 
                      border: selectedRoomId === r.roomId ? '2px solid #20a9e7' : '1px solid #e0e0e0',
                      boxShadow: selectedRoomId === r.roomId ? '0 4px 12px rgba(32,169,231,0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      bgcolor: selectedRoomId === r.roomId ? '#f0fbff' : '#fff'
                    }}
                  >
                    <CardActionArea onClick={() => handleRoomClick(r.roomId)} sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 48, height: 48, borderRadius: '12px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: selectedRoomId === r.roomId ? '#20a9e7' : '#f0f0f0',
                          color: selectedRoomId === r.roomId ? '#fff' : '#888',
                          mr: 2
                        }}>
                          {selectedRoomId === r.roomId ? <CheckCircleIcon fontSize="large" /> : <MeetingRoomIcon />}
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                              {r.name}
                            </Typography>
                            <Box sx={{ 
                              bgcolor: '#ED6004', color: '#fff', fontSize: '11px', 
                              px: 1, py: 0.25, borderRadius: 1, fontWeight: 'medium' 
                            }}>
                              Đang trống
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {r.price?.toLocaleString()}₫
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">0/1 người</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                  Không có phòng trống nào trong khu trọ này.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedRoomId}
          sx={{ 
            bgcolor: '#20a9e7', 
            '&:hover': { bgcolor: '#1988bd' }, 
            textTransform: 'none',
            '&.Mui-disabled': { bgcolor: '#bde3f4', color: '#fff' }
          }}
        >
          Xác nhận chuyển phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalChangeRoom;
