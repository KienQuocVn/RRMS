import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Grid, Typography, CircularProgress } from '@mui/material'

import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { getRoomById, getServiceRoombyRoomId } from '~/apis/roomAPI'
import { getContractByIdRoom } from '~/apis/contractTemplateAPI'

// Sub-components
import RoomInfoCard from './components/RoomInfoCard'
import RoomServicesCard from './components/RoomServicesCard'
import TenantListCard from './components/TenantListCard'
import InvoiceHistoryCard from './components/InvoiceHistoryCard'
import RentalHistoryCard from './components/RentalHistoryCard'

const DetailRoom = ({ setIsAdmin, setIsNavAdmin, isNavAdmin, motels, setmotels }) => {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [contract, setContract] = useState(null)
  const [roomServices, setRoomServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAdmin(true)
    setIsNavAdmin(true)
    const fetchAllData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchDataRoom(roomId),
          fetchDataRoomServices(roomId),
          fetchContractRoom(roomId)
        ])
      } catch (error) {
        console.error('Error fetching room details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [roomId, setIsAdmin])

  const fetchDataRoom = async (id) => {
    if (id) {
      const response = await getRoomById(id)
      setRoom(response)
    }
  }

  const fetchContractRoom = async (id) => {
    if (id) {
      const response = await getContractByIdRoom(id)
      setContract(response)
    }
  }

  const fetchDataRoomServices = async (id) => {
    if (id) {
      const response = await getServiceRoombyRoomId(id)
      setRoomServices(response)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh'
      }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={isNavAdmin}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : room ? (
        <Box sx={{ mt: 3, px: 2, mx: 'auto' }}>
          <Grid container spacing={3}>
            {/* Left Column: Room Info (Sticky) */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: { md: 'sticky' }, top: 20 }}>
                <RoomInfoCard room={room} contract={contract} />
              </Box>
            </Grid>

            {/* Right Column: Details */}
            <Grid item xs={12} md={8}>
              <RoomServicesCard roomServices={roomServices} />
              <TenantListCard contract={contract} />
              <InvoiceHistoryCard />
              <RentalHistoryCard contract={contract} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography color="error">Không tìm thấy thông tin phòng.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default DetailRoom
