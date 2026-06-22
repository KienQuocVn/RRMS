import { useState, useEffect, useCallback } from 'react'
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
} from '@mui/material'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'
import { getRoomById, getRoomByMotelIdYContract } from '~/apis/roomAPI'
import { getContractByIdRoom2, updateContractDetail } from '~/apis/contractTemplateAPI'
import { isReserveAPlaceStatus } from '~/utils/apiAdapters'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

const showAlertAboveDialog = (options) =>
  Swal.fire({
    ...options,
    didOpen: (popup) => {
      const container = popup?.parentElement
      if (container) {
        container.style.zIndex = '1500'
      }
      if (typeof options.didOpen === 'function') {
        options.didOpen(popup)
      }
    }
  })

const isOccupiedRoom = (room) => {
  const contractStatus = room?.latestContract?.status
  const reserveStatus = room?.reserveAPlace?.status

  if (['ACTIVE', 'IATExpire', 'EXPIRING', 'DEPOSITED'].includes(contractStatus)) {
    return true
  }

  return isReserveAPlaceStatus(reserveStatus)
}

function ModalChangeRoom({ toggleModal, modalOpen, roomId, motelId: motelIdProp, onSuccess }) {
  const { motelId: routeMotelId } = useParams()
  const activeMotelId = motelIdProp || routeMotelId

  const [room, setRoom] = useState(null)
  const [roomSelect, setRoomSelect] = useState(null)
  const [contract, setContract] = useState(null)
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const resetState = () => {
    setRoomSelect(null)
    setSelectedRoomId(null)
  }

  const fetchDataRoom = async (currentRoomId) => {
    const response = await getRoomById(currentRoomId)
    if (response) {
      setRoom(response)
    }
  }

  const fetchDataContract = async (currentRoomId) => {
    const response = await getContractByIdRoom2(currentRoomId)
    if (response) {
      setContract(response)
    }
  }

  const fetchRooms = useCallback(async () => {
    if (!activeMotelId || !roomId) return

    setLoading(true)
    try {
      const dataRoom = await getRoomByMotelIdYContract(activeMotelId)
      const emptyRooms = (dataRoom || []).filter(
        (item) => item.roomId !== roomId && !isOccupiedRoom(item)
      )
      setRooms(emptyRooms)
    } catch (error) {
      console.error(error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [activeMotelId, roomId])

  const handleRoomClick = async (clickedRoomId) => {
    if (clickedRoomId === selectedRoomId) {
      setSelectedRoomId(null)
      setRoomSelect(null)
      return
    }

    setSelectedRoomId(clickedRoomId)
    try {
      const dataRoom = await getRoomById(clickedRoomId)
      setRoomSelect(dataRoom)
    } catch (error) {
      console.error(error)
      setRoomSelect(null)
    }
  }

  useEffect(() => {
    if (!modalOpen || !roomId || !activeMotelId) return

    resetState()
    fetchDataRoom(roomId)
    fetchDataContract(roomId)
    fetchRooms()
  }, [roomId, activeMotelId, modalOpen, fetchRooms])

  const handleSubmit = async () => {
    if (!roomId || !roomSelect || !contract?.contractId) {
      showAlertAboveDialog({
        icon: 'error',
        title: 'Chuyển phòng thất bại!',
        text: 'Vui lòng chọn phòng trống để chuyển.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      })
      return
    }

    try {
      setSubmitting(true)
      await updateContractDetail(
        contract.contractId,
        roomSelect.roomId,
        contract.deposit ?? room.deposit ?? 0,
        contract.price ?? room.price ?? 0,
        contract.debt ?? 0
      )

      await showAlertAboveDialog({
        icon: 'success',
        title: 'Chuyển phòng thành công!',
        text: `Đã chuyển từ "${room?.name}" sang "${roomSelect.name}". Dịch vụ, tài sản và thông tin hợp đồng đã được chuyển theo.`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      })

      if (typeof onSuccess === 'function') {
        await onSuccess()
      }

      toggleModal()
    } catch (error) {
      showAlertAboveDialog({
        icon: 'error',
        title: 'Chuyển phòng thất bại!',
        text: error.message || 'Có lỗi xảy ra khi chuyển phòng.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20a9e7'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          borderBottom: '1px solid #eee',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          pb: 2
        }}>
        <Box
          sx={{
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
          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            Danh sách phòng trống
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            Chọn phòng để chuyển từ &quot;{room?.name || '...'}&quot;
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
                    }}>
                    <CardActionArea onClick={() => handleRoomClick(r.roomId)} sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: selectedRoomId === r.roomId ? '#20a9e7' : '#f0f0f0',
                            color: selectedRoomId === r.roomId ? '#fff' : '#888',
                            mr: 2
                          }}>
                          {selectedRoomId === r.roomId ? (
                            <CheckCircleIcon fontSize="large" />
                          ) : (
                            <MeetingRoomIcon />
                          )}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                              {r.name}
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: '#9e9e9e',
                                color: '#fff',
                                fontSize: '11px',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontWeight: 'medium'
                              }}>
                              Đang trống
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {Number(r.price || 0).toLocaleString('vi-VN')}₫
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
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }} disabled={submitting}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedRoomId || submitting || !contract?.contractId}
          sx={{
            bgcolor: '#20a9e7',
            '&:hover': { bgcolor: '#1988bd' },
            textTransform: 'none',
            '&.Mui-disabled': { bgcolor: '#bde3f4', color: '#fff' }
          }}>
          {submitting ? 'Đang chuyển...' : 'Xác nhận chuyển phòng'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalChangeRoom
