import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Button, IconButton, TextField, InputAdornment, Badge, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SearchIcon from '@mui/icons-material/Search'
import VehicleListTable from './components/VehicleListTable'
import AddVehicleModal from './components/AddVehicleModal'
import { getCarsByMotelId } from '~/apis/carAPI'
import { getRoomByMotelId } from '~/apis/roomAPI'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { Colors } from '~/theme'
const PRIMARY_COLOR = '#20a9e7';
const VehicleManager = ({ motels, setmotels, setIsAdmin, isNavAdmin, setIsNavAdmin }) => {
  const { motelId } = useParams()
  const [vehicles, setVehicles] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vehiclesData, roomsData] = await Promise.all([
        getCarsByMotelId(motelId),
        getRoomByMotelId(motelId)
      ])
      setVehicles(vehiclesData)
      setRooms(roomsData)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu phương tiện:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsAdmin(true)
    if (motelId) {
      fetchData()
    }
  }, [motelId, setIsAdmin])

  const handleOpenAddModal = () => setIsAddModalOpen(true)
  const handleCloseAddModal = () => setIsAddModalOpen(false)

  const handleRefresh = () => {
    fetchData()
  }

  // Lọc xe theo search term (tên khách thuê)
  const filteredVehicles = vehicles.filter(v => 
    v.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', width: '100%' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />
      <Box sx={{ p: 2 }}>
        {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 4, height: 40, bgcolor: Colors.info, mr: 2, borderRadius: 1 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Tất cả xe
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Danh sách các xe của khách thuê
            </Typography>
          </Box>
        </Box>
        
        <IconButton 
          onClick={handleOpenAddModal}
          sx={{ 
            bgcolor: PRIMARY_COLOR, 
            color: 'white',
            '&:hover': { bgcolor: Colors.info },
            boxShadow: 2
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Filter and Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, bgcolor: 'white', p: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Badge badgeContent={0} color="success" sx={{ mr: 2 }}>
          <IconButton size="small">
            <FilterAltOutlinedIcon />
          </IconButton>
        </Badge>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <TextField
          size="small"
          placeholder="Tìm tên khách thuê..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 8 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress sx={{ color: Colors.primary }} />
        </Box>
      ) : (
        <VehicleListTable 
          vehicles={filteredVehicles} 
          rooms={rooms} 
          onRefresh={handleRefresh}
        />
      )}

      {/* Add Modal */}
      <AddVehicleModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        rooms={rooms}
        motelId={motelId}
        onSuccess={handleRefresh}
      />
      </Box>
    </Box>
  )
}

export default VehicleManager
