import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Swal from 'sweetalert2'
import { deleteMotel, getMotelById } from '~/apis/motelAPI'
import ModalCreateHome from '~/pages/admin/ManagerHome/ModelCreateHome'
import { isValidRouteParam } from '~/utils/apiAdapters'
import MotelManagerCard from './components/MotelManagerCard'
import MotelListModal from './components/MotelListModal'
import NavMenuItems from './components/NavMenuItems'

const NavWData = ({ motels }) => {
  const username = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).username
    : null

  const { motelId } = useParams()
  const [motel, setMotel] = useState(null)
  const [selectedMotelId, setSelectedMotelId] = useState(null)
  const [managerOpen, setManagerOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  // Resolve active motel
  useEffect(() => {
    if (isValidRouteParam(motelId)) {
      getMotelById(motelId)
        .then((res) => setMotel(res.data.result))
        .catch((err) => console.error('Error fetching motel:', err))
    } else if (motels?.length > 0) {
      setMotel(motels[0])
    }
  }, [motels, motelId])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xóa không?',
      text: 'Bạn sẽ không thể hoàn tác hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
    })

    if (result.isConfirmed) {
      try {
        await deleteMotel(id)
        Swal.fire('Đã xóa!', 'Motel đã được xóa.', 'success')
        window.location.reload()
      } catch {
        Swal.fire('Lỗi', 'Không thể xóa motel.', 'error')
      }
    }
  }

  const handleEdit = (id) => {
    setSelectedMotelId(id)
    setAddOpen(true)
    setManagerOpen(false)
  }

  return (
    <Box sx={{ minHeight: 125, display: 'flex', p: '0 10px 0 0' }}>
      {/* Left: Motel selector card */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <MotelManagerCard
          motel={motel}
          motelCount={motels.length}
          onOpenManager={() => setManagerOpen(true)}
          onOpenAdd={() => setAddOpen(true)}
          setSelectedMotelId={setSelectedMotelId}
        />
      </Box>

      {/* Right: Scrollable menu items */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <NavMenuItems motelId={motel?.motelId} />
      </Box>

      {/* Motel list modal */}
      <MotelListModal
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
        motels={motels}
        currentMotel={motel}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Create/Edit motel modal */}
      <ModalCreateHome
        username={username}
        MotelId={selectedMotelId}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </Box>
  )
}

export default NavWData
