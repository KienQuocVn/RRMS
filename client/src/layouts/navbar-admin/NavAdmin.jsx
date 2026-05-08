import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Swal from 'sweetalert2'
import { getStoredAuthUser, logout as logoutRequest } from '~/apis/accountAPI'
import { getMotelById } from '~/apis/motelAPI'
import { isValidRouteParam } from '~/utils/apiAdapters'
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
    } else if (isValidRouteParam(motelId)) {
      getMotelById(motelId)
        .then((res) => setMotel(res.data.result))
        .catch((err) => console.error('KhÃ´ng thá»ƒ láº¥y thÃ´ng tin motel:', err))
    } else if (motels?.length > 0) {
      setMotel(motels[0])
    }
  }, [motels, motelId])

  const handleLogout = async () => {
    const token = getStoredAuthUser()?.token ?? null

    if (!token) {
      sessionStorage.removeItem('user')
      navigate('/login')
      Swal.fire({ icon: 'warning', title: 'ThÃ´ng bÃ¡o', text: 'KhÃ´ng tÃ¬m tháº¥y token, vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.' })
      return
    }

    try {
      await logoutRequest(token)
      sessionStorage.removeItem('user')
      navigate('/login')
      Swal.fire({ icon: 'success', title: 'ThÃ nh cÃ´ng', text: 'ÄÄƒng xuáº¥t thÃ nh cÃ´ng!' })
    } catch (error) {
      if (error?.response?.status === 401) {
        sessionStorage.removeItem('user')
        navigate('/login')
        Swal.fire({ icon: 'success', title: 'ThÃ nh cÃ´ng', text: 'ÄÄƒng xuáº¥t thÃ nh cÃ´ng!' })
        return
      }

      Swal.fire({
        icon: 'error',
        title: 'ÄÄƒng xuáº¥t tháº¥t báº¡i',
        text: error?.response?.data?.message || 'ÄÃ£ xáº£y ra lá»—i khi thá»±c hiá»‡n Ä‘Äƒng xuáº¥t.'
      })
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
          boxShadow: '0 1px 5px rgba(190,190,190,.46)'
        }}
      >
        <Box sx={{ px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + back arrow */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" onClick={() => setIsAdmin(false)} sx={{ mr: 1, color: '#fff', cursor: 'pointer' }}>
              â†
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
      {isNavAdmin && motels.length > 0 && <NavWData motels={motels} setmotels={setmotels} />}
    </Box>
  )
}

export default NavAdmin
