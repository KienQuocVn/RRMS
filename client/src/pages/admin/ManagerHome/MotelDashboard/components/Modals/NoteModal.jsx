import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import Swal from 'sweetalert2'

import { updateRoom } from '~/apis/roomAPI'

const NoteModal = ({ open, onClose, room, onUpdateSuccess }) => {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && room) {
      setNote(room.description || '')
    }
  }, [open, room])

  const handleSave = async () => {
    if (!room) return
    
    setLoading(true)
    try {
      const updatedRoom = { ...room, description: note }
      await updateRoom(room.roomId, updatedRoom)
      
      Swal.fire({ icon: 'success', title: 'Thông báo', text: 'Cập nhật ghi chú phòng thành công!' })
      
      if (onUpdateSuccess) onUpdateSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating room note:', error)
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật ghi chú phòng.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <EditNoteIcon />
        Ghi chú phòng &quot;{room?.name}&quot;
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ghi chú nội bộ cho phòng này (chỉ quản lý mới xem được).
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          placeholder="Nhập ghi chú..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Hủy bỏ
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu ghi chú'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NoteModal
