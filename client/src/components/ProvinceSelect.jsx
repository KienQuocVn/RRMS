// components/LocationSelect.js
import { useState, useEffect } from 'react'
import { MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material'
import { getPhuongXaByTinh, getTinhThanh } from '~/apis/addressAPI'

const LocationSelect = ({ onChangeProvince, onChangeDistrict, onChangeWard }) => {
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [openTinhThanh, setOpenTinhThanh] = useState(false)
  const [openPhuongXa, setOpenPhuongXa] = useState(false)

  useEffect(() => {
    getTinhThanh()
      .then((response) => {
        if (response.data && response.data.error === 0) {
          setProvinces(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error)
      })
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      getPhuongXaByTinh(selectedProvince)
        .then((response) => {
          if (response.data && response.data.error === 0) {
            setWards(response.data.data)
          } else {
            setWards([])
          }
        })
        .catch((error) => {
          console.error('Error fetching wards:', error)
          setWards([])
        })
    } else {
      setWards([])
    }
  }, [selectedProvince])

  const handleCloseTinhThanh = () => {
    setOpenTinhThanh(false)
  }

  const handleOpenTinhThanh = () => {
    setOpenTinhThanh(true)
  }

  const handleClosePhuongXa = () => {
    setOpenPhuongXa(false)
  }

  const handleOpenPhuongXa = () => {
    setOpenPhuongXa(true)
  }

  return (
    <Box sx={{ marginY: 4 }}>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="province-label">Chọn Tỉnh Thành</InputLabel>
        <Select
          labelId="province-label"
          id="province"
          value={selectedProvince}
          open={openTinhThanh}
          onClose={handleCloseTinhThanh}
          onOpen={handleOpenTinhThanh}
          onChange={(e) => {
            const provId = e.target.value
            setSelectedProvince(provId)
            setSelectedWard('')
            handleCloseTinhThanh()
            const selected = provinces.find((item) => item.id === provId)
            if (selected) {
              onChangeProvince && onChangeProvince(selected.full_name)
            }
            if (onChangeDistrict) {
              onChangeDistrict('')
            }
          }}
          label="Chọn Tỉnh Thành">
          <MenuItem value="">
            <em>-- Chọn Tỉnh Thành --</em>
          </MenuItem>
          {provinces.map((province) => (
            <MenuItem key={province.id} value={province.id}>
              {province.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={!selectedProvince}>
        <InputLabel id="ward-label">Chọn Phường Xã</InputLabel>
        <Select
          labelId="ward-label"
          id="ward"
          value={selectedWard}
          open={openPhuongXa}
          onClose={handleClosePhuongXa}
          onOpen={handleOpenPhuongXa}
          onChange={(e) => {
            handleClosePhuongXa()
            setSelectedWard(e.target.value)
            const selected = wards.find((item) => item.id === e.target.value || item.full_name === e.target.value)
            const wardName = selected ? selected.full_name : e.target.value
            onChangeWard && onChangeWard(wardName)
          }}
          label="Chọn Phường Xã">
          <MenuItem value="">
            <em>-- Chọn Phường Xã --</em>
          </MenuItem>
          {wards.map((ward) => (
            <MenuItem key={ward.id} value={ward.id}>
              {ward.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default LocationSelect
