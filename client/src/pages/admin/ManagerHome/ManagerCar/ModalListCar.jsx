import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'

import { getRoomById } from '~/apis/roomAPI'
import { getCarByRoomId, deleteCar } from '~/apis/carAPI'
import ModalCreateCar from './ModalCreateCar'

function ModalListCar({ toggleModal, modalOpen, roomId }) {
  const [room, setRoom] = useState(null)
  const [cars, setCars] = useState([])
  const [carOpen, setCarOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState(null)

  const toggleCar = () => setCarOpen(!carOpen)

  // Fetch Room Data
  const fetchDataRoom = async (id) => {
    try {
      const response = await getRoomById(id)
      if (response) {
        setRoom(response)
      }
    } catch (error) {
      console.error('Fetch Room Error:', error)
    }
  }

  // Fetch Cars
  const fetchCarRoom = async (id) => {
    try {
      const response = await getCarByRoomId(id)
      if (response) {
        setCars(response)
      }
    } catch (error) {
      console.error('Fetch Cars Error:', error)
    }
  }

  const handleDelete = async (carId) => {
    try {
      await deleteCar(carId)
      Swal.fire({
        icon: 'success',
        title: 'Xóa thành công!',
        text: 'Xe đã được xóa khỏi danh sách.',
        confirmButtonText: 'Đóng'
      })
      // Fetch fresh data instead of window reload for better UX
      fetchCarRoom(roomId)
    } catch (error) {
      console.error('Lỗi khi xóa xe:', error)
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: 'Không thể xóa xe, vui lòng thử lại sau.',
        confirmButtonText: 'Đóng'
      })
    }
  }

  useEffect(() => {
    if (roomId && modalOpen) {
      fetchDataRoom(roomId)
      fetchCarRoom(roomId)
    }
  }, [roomId, modalOpen])

  return (
    <>
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
            <DirectionsCarIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Danh sách xe - {room ? room.name : 'Đang tải...'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          {cars && cars.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
              {cars.map((car, i) => (
                <Box key={car.carId || i}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          color="primary"
                          onClick={() => {
                            setSelectedCarId(car.carId)
                            toggleCar()
                          }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDelete(car.carId)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }>
                    <ListItemAvatar>
                      <Avatar src={car.image || ''} variant="rounded">
                        <DirectionsCarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600">
                          {car.name}
                        </Typography>
                      }
                      secondary={car.number}
                    />
                  </ListItem>
                  {i < cars.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Chưa có xe nào trong phòng này.</Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={toggleModal} color="inherit" variant="text">
            Đóng
          </Button>
          <Button
            onClick={() => {
              setSelectedCarId('Create')
              toggleCar()
            }}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}>
            Thêm xe
          </Button>
        </DialogActions>
      </Dialog>

      <ModalCreateCar
        open={carOpen}
        onClose={() => {
          toggleCar()
          // Refresh data after modal closes
          fetchCarRoom(roomId)
        }}
        roomId={roomId}
        carId={selectedCarId}
      />
    </>
  )
}

export default ModalListCar
