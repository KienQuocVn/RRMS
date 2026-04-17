import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoadingPage from '~/components/LoadingPage/LoadingPage'

const ModalSearch = ({ filterSearch, open, handleClose }) => {
  const [keyword, setKeyword] = useState('')
  const [quanHuyen, setQuanHuyen] = useState('')
  const { t } = useTranslation()
  const [propertyType, setPropertyType] = useState('phong-tro')
  const [occupation, setOccupation] = useState('nganh-nghe-khac')
  const [provinces, setProvinces] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [districts, setDistricts] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleFilter = (provinceName, districtName) => {
    filterSearch(provinceName, districtName)
  }

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      const data = await response.json()
      setProvinces(data.data)
    } catch (error) {
      console.error('Load provinces failed:', error)
    }
  }

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`)
      const data = await response.json()
      setDistricts(data.data)
    } catch (error) {
      console.error('Load districts failed:', error)
    }
  }

  useEffect(() => {
    fetchProvinces()
  }, [])

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value
    setSelectedProvince(provinceId)

    const selectedProvinceObject = provinces.find((province) => province.id === provinceId)

    if (selectedProvinceObject) {
      setKeyword(selectedProvinceObject.full_name)
    } else {
      setKeyword('')
    }

    fetchDistricts(provinceId)
  }

  const handleDistrictChange = (event) => {
    const selectedValue = event.target.value
    setSelectedDistrict(selectedValue)

    const selectedDistrictObject = districts.find((district) => district.id === selectedValue)
    if (selectedDistrictObject) {
      setQuanHuyen(selectedDistrictObject.full_name)
    } else {
      setQuanHuyen('')
    }
  }

  const propertyTypes = ['phong-tro', 'nha-cho-thue', 'van-phong', 'can-ho', 'kho', 'ky-tuc-xa', 'pass-phong']
  const occupations = ['sinh-vien', 'nhan-vien-van-phong', 'nhan-vien-xi-nghiep', 'nganh-nghe-khac']

  if (!provinces.length) {
    return <LoadingPage />
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '95%' : 800,
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          borderRadius: 2,
          p: isMobile ? 2 : 4
        }}
      >
        <Paper elevation={3} sx={{ maxWidth: '100%', padding: isMobile ? 2 : 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              backgroundColor: '#1e90ff',
              color: 'white',
              padding: 1,
              textAlign: 'center',
              borderRadius: 1
            }}
          >
            {t('tieu-chi-tim-kiem')}
          </Typography>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('khu-vuc-tim-kiem')}
            </Typography>
            <FormControl fullWidth>
              <Grid container justifyContent="center" spacing={isMobile ? 1 : 2}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                    <InputLabel id="province-label">{t('tinh-thanhpho')}</InputLabel>
                    <Select labelId="province-label" id="province" value={selectedProvince} onChange={handleProvinceChange} label={t('tinh-thanhpho')}>
                      <MenuItem value="">
                        <em>{t('tinh-thanhpho')}</em>
                      </MenuItem>
                      {provinces.map((province) => (
                        <MenuItem key={province.id} value={province.id}>
                          {province.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="district-label">{t('quan-huyen')}</InputLabel>
                    <Select
                      labelId="district-label"
                      id="district"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      size={isMobile ? 'small' : 'medium'}
                      label={t('quan-huyen')}
                    >
                      <MenuItem value="">
                        <em>{t('quan-huyen')}</em>
                      </MenuItem>
                      {districts.map((district) => (
                        <MenuItem key={district.id} value={district.id}>
                          {district.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('loai-hinh')}
            </Typography>
            <Grid container spacing={isMobile ? 0.5 : 1}>
              {propertyTypes.map((type) => (
                <Grid item xs={6} key={type}>
                  <Button
                    variant={propertyType === type ? 'contained' : 'outlined'}
                    onClick={() => setPropertyType(type)}
                    startIcon={propertyType === type ? <CheckCircleIcon sx={{ color: '#ffffff', ml: -1 }} /> : null}
                    sx={{
                      width: '100%',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      backgroundColor: propertyType === type ? '#1e90ff' : 'white',
                      color: propertyType === type ? 'white' : 'black',
                      fontSize: isMobile ? '0.75rem' : '1rem'
                    }}
                  >
                    {t(type)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('hien-tai-ban-dang-lam-gi')}
            </Typography>
            <Grid container spacing={isMobile ? 0.5 : 1}>
              {occupations.map((occ) => (
                <Grid item xs={6} key={occ}>
                  <Button
                    variant={occupation === occ ? 'contained' : 'outlined'}
                    onClick={() => setOccupation(occ)}
                    startIcon={occupation === occ ? <CheckCircleIcon sx={{ color: '#ffffff', ml: -1 }} /> : null}
                    sx={{
                      width: '100%',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      backgroundColor: occupation === occ ? '#1e90ff' : 'white',
                      color: occupation === occ ? 'white' : 'black',
                      fontSize: isMobile ? '0.75rem' : '1rem'
                    }}
                  >
                    {t(occ)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                width: isMobile ? '100%' : '48%',
                textTransform: 'none',
                marginBottom: isMobile ? 1 : 0,
                backgroundColor: '#1e90ff',
                border: '1px solid gray',
                color: '#ffffff'
              }}
            >
              {t('dong-bo-loc')}
            </Button>
            <Button
              variant="contained"
              sx={{ width: isMobile ? '100%' : '48%', textTransform: 'none', backgroundColor: '#1e90ff' }}
              onClick={() => {
                handleFilter(keyword, quanHuyen)
                handleClose()
              }}
            >
              {t('tim-kiem-ngay')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  )
}

export default ModalSearch
