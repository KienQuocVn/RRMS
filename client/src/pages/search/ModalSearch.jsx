import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VIETNAM_PROVINCES } from '~/configs/vietnamProvinces'

const ModalSearch = ({ filterSearch, open, handleClose }) => {
  const [quanHuyen, setQuanHuyen] = useState('')
  const { t } = useTranslation()
  const [propertyType, setPropertyType] = useState('')
  const [selectedProvince, setSelectedProvince] = useState(null) // object province
  const [step, setStep] = useState('province') // 'province' | 'ward'
  const [searchText, setSearchText] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const propertyTypes = [
    { value: 'phong-tro', label: 'Phòng trọ, nhà trọ' },
    { value: 'nha-cho-thue', label: 'Chung cư' },
    { value: 'can-ho', label: 'Căn hộ dịch vụ' },
    { value: 'ky-tuc-xa', label: 'Ký túc xá' },
    { value: 'pass-phong', label: 'Ở ghép & pass phòng' }
  ]

  const filteredProvinces = useMemo(() => {
    if (!searchText.trim()) return VIETNAM_PROVINCES
    const lower = searchText.toLowerCase()
    return VIETNAM_PROVINCES.filter((p) => p.name.toLowerCase().includes(lower))
  }, [searchText])

  const filteredWards = useMemo(() => {
    if (!selectedProvince) return []
    if (!searchText.trim()) return selectedProvince.wards
    const lower = searchText.toLowerCase()
    return selectedProvince.wards.filter((w) => w.toLowerCase().includes(lower))
  }, [selectedProvince, searchText])

  const handleSelectProvince = (province) => {
    setSelectedProvince(province)
    setStep('ward')
    setSearchText('')
    setQuanHuyen('')
  }

  const handleSelectWard = (ward) => {
    setQuanHuyen(ward)
  }

  const handleBack = () => {
    setStep('province')
    setSelectedProvince(null)
    setQuanHuyen('')
    setSearchText('')
  }

  const handleApply = () => {
    const provinceName = selectedProvince?.name || ''
    filterSearch(provinceName, quanHuyen)
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setStep('province')
    setSelectedProvince(null)
    setQuanHuyen('')
    setSearchText('')
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '95%' : 820,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          border: 'none',
          boxShadow: 24,
          borderRadius: 3,
          p: isMobile ? 2 : 3
        }}>
        <Paper elevation={0} sx={{ maxWidth: '100%', borderRadius: 2 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #f1f5f9'
            }}>
            {step === 'ward' && (
              <Button
                size="small"
                startIcon={<KeyboardArrowLeftRoundedIcon />}
                onClick={handleBack}
                sx={{ textTransform: 'none', color: '#64748b', minWidth: 0, pr: 1 }}>
                Quay lại
              </Button>
            )}
            <Typography variant="h6" fontWeight="bold">
              {step === 'province' ? 'Chọn tỉnh / thành phố' : `${selectedProvince?.name} — Chọn phường / xã`}
            </Typography>
          </Box>

          {/* Search input */}
          <TextField
            fullWidth
            size="small"
            placeholder={step === 'province' ? 'Tìm tỉnh / thành phố...' : 'Tìm phường / xã...'}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f8fafc'
              }
            }}
          />

          {/* Danh sách tỉnh */}
          {step === 'province' && (
            <Grid container spacing={1}>
              {filteredProvinces.map((province) => (
                <Grid item xs={12} sm={6} key={province.id}>
                  <Button
                    fullWidth
                    variant={selectedProvince?.id === province.id ? 'contained' : 'outlined'}
                    onClick={() => handleSelectProvince(province)}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      py: 1,
                      bgcolor: selectedProvince?.id === province.id ? '#1e90ff' : 'white',
                      color: selectedProvince?.id === province.id ? 'white' : '#0f172a',
                      borderColor: selectedProvince?.id === province.id ? '#1e90ff' : '#e2e8f0',
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      fontWeight: 700
                    }}>
                    {province.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Danh sách phường/xã */}
          {step === 'ward' && selectedProvince && (
            <Grid container spacing={1}>
              {/* Chọn toàn tỉnh */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant={!quanHuyen ? 'contained' : 'outlined'}
                  startIcon={!quanHuyen ? <CheckCircleIcon sx={{ color: '#ffffff' }} /> : null}
                  onClick={() => setQuanHuyen('')}
                  sx={{
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1,
                    mb: 0.5,
                    bgcolor: !quanHuyen ? '#1e90ff' : 'white',
                    color: !quanHuyen ? 'white' : '#0f172a',
                    borderColor: !quanHuyen ? '#1e90ff' : '#e2e8f0',
                    fontWeight: 700
                  }}>
                  Toàn {selectedProvince.name}
                </Button>
              </Grid>

              {filteredWards.map((ward) => (
                <Grid item xs={12} sm={6} key={ward}>
                  <Button
                    fullWidth
                    variant={quanHuyen === ward ? 'contained' : 'outlined'}
                    startIcon={quanHuyen === ward ? <CheckCircleIcon sx={{ color: '#ffffff', ml: -1 }} /> : null}
                    onClick={() => handleSelectWard(ward)}
                    sx={{
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      py: 1,
                      bgcolor: quanHuyen === ward ? '#1e90ff' : 'white',
                      color: quanHuyen === ward ? 'white' : '#0f172a',
                      borderColor: quanHuyen === ward ? '#1e90ff' : '#e2e8f0',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 600
                    }}>
                    {ward}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Phần Loại hình */}
          <Box sx={{ mt: 3, mb: 2, pt: 2, borderTop: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('loai-hinh')}
            </Typography>
            <Grid container spacing={isMobile ? 0.5 : 1}>
              {propertyTypes.map((type) => (
                <Grid item xs={6} key={type.value}>
                  <Button
                    variant={propertyType === type.value ? 'contained' : 'outlined'}
                    onClick={() => setPropertyType(propertyType === type.value ? '' : type.value)}
                    startIcon={propertyType === type.value ? <CheckCircleIcon sx={{ color: '#ffffff', ml: -1 }} /> : null}
                    sx={{
                      width: '100%',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      backgroundColor: propertyType === type.value ? '#1e90ff' : 'white',
                      color: propertyType === type.value ? 'white' : 'black',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 600
                    }}>
                    {type.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Nút action */}
          <FormControl fullWidth>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={1.5}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                fullWidth
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 700,
                  color: '#374151',
                  borderColor: '#d1d5db',
                  '&:hover': { bgcolor: '#f9fafb' }
                }}>
                {t('dong-bo-loc')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleApply}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 700,
                  bgcolor: '#1e90ff',
                  '&:hover': { bgcolor: '#1a7fe0' }
                }}>
                {t('tim-kiem-ngay')}
              </Button>
            </Box>
          </FormControl>
        </Paper>
      </Box>
    </Modal>
  )
}

export default ModalSearch
