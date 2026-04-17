import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Swal from 'sweetalert2'
import { env } from '~/configs/environment'
import { getMotelById } from '~/apis/motelAPI'
import AnnouncementBanner from './components/AnnouncementBanner'
import NavAdminLinks from './components/NavAdminLinks'
import NavWData from './NavWData'

const NavAdmin = ({ setIsAdmin, isNavAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const navigate = useNavigate()
  const [motel, setMotel] = useState(null)

  // Resolve active motel from URL param or first in list
  useEffect(() => {
    if (motels?.length > 0 && !motelId) {
      setMotel(motels[0])
    } else if (motelId) {
      getMotelById(motelId)
        .then((res) => setMotel(res.data.result))
        .catch((err) => console.error('Không thể lấy thông tin motel:', err))
    }
  }, [motels, motelId])

  const handleLogout = async () => {
    const token = sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')).token
      : null

    if (!token) {
      Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Không tìm thấy token, vui lòng đăng nhập lại.' })
      return
    }

    try {
      const response = await fetch(`${env.API_URL}/authen/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        sessionStorage.removeItem('user')
        navigate('/login')
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đăng xuất thành công!' })
      } else {
        const errorData = await response.json()
        Swal.fire({ icon: 'error', title: 'Đăng xuất thất bại', text: `Lỗi: ${errorData.message}` })
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Đã xảy ra lỗi khi thực hiện đăng xuất.' })
    }
  }

  const tokenExists = sessionStorage.getItem('user') !== null

  return (
    <Box component="header">
      {/* Announcement banner */}
      <AnnouncementBanner />

      {/* Sticky nav bar */}
      <Box
        sx={{
          bgcolor: '#3c89d5',
          width: '100%',
          zIndex: 10,
          borderBottom: '1px solid #ececec',
          boxShadow: '0 1px 5px rgba(190,190,190,.46)',
        }}
      >
        <Box sx={{ px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + back arrow */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" onClick={() => setIsAdmin(false)} sx={{ mr: 1, color: '#fff', cursor: 'pointer' }}>
              ←
            </Box>
            <Box
              component="img"
              src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fbg2.png?alt=media&token=568627e1-bedb-4239-84f7-a67076d52af4"
              sx={{ width: 110, height: 54 }}
            />
          </Link>

          {/* Nav links */}
          <NavAdminLinks
            motel={motel}
            setIsNavAdmin={setIsNavAdmin}
            handleLogout={handleLogout}
            tokenExists={tokenExists}
          />
        </Box>
      </Box>

      {/* Sub nav with motel list + menu items */}
      {isNavAdmin && motels.length > 0 && (
        <NavWData motels={motels} setmotels={setmotels} />
      )}
    </Box>
  )
}

export default NavAdmin
