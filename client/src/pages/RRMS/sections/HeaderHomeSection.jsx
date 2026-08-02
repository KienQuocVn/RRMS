import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import { VIETNAM_PROVINCES } from '~/configs/vietnamProvinces'

const PRICE_OPTIONS = [
  { label: 'Tất cả mức giá', minPrice: null, maxPrice: null },
  { label: 'Dưới 3 triệu', minPrice: null, maxPrice: 3000000 },
  { label: '3 - 5 triệu', minPrice: 3000000, maxPrice: 5000000 },
  { label: '5 - 10 triệu', minPrice: 5000000, maxPrice: 10000000 },
  { label: '10 - 15 triệu', minPrice: 10000000, maxPrice: 15000000 },
  { label: 'Trên 15 triệu', minPrice: 15000000, maxPrice: null }
]

const AREA_OPTIONS = [
  { label: 'Tất cả diện tích', minArea: null, maxArea: null },
  { label: 'Dưới 20 m²', minArea: null, maxArea: 20 },
  { label: '20 - 30 m²', minArea: 20, maxArea: 30 },
  { label: '30 - 50 m²', minArea: 30, maxArea: 50 },
  { label: '50 - 70 m²', minArea: 50, maxArea: 70 },
  { label: 'Trên 70 m²', minArea: 70, maxArea: null }
]

const PROPERTY_TYPE_OPTIONS = [
  { value: 'phong-tro-nha-tro', label: 'Phòng trọ, nhà trọ' },
  { value: 'chung-cu', label: 'Chung cư' },
  { value: 'can-ho-chung-cu', label: 'Căn hộ dịch vụ' },
  { value: 'ky-tuc-xa', label: 'Ký túc xá' },
  { value: 'o-ghep-pass-phong', label: 'Ở ghép & pass phòng' }
]

const getRangeLabel = (options, keyMap, filters, fallbackLabel) => {
  const matchedOption = options.find((option) =>
    Object.entries(keyMap).every(([filterKey, optionKey]) => filters?.[filterKey] === option[optionKey])
  )

  return matchedOption?.label || fallbackLabel
}

const getPropertyTypeLabel = (value) =>
  PROPERTY_TYPE_OPTIONS.find((option) => option.value === value)?.label || '...Thêm'

const SearchActionButton = ({ title, value, icon, onClick, wide = false, active = false }) => (
  <Button
    onClick={onClick}
    variant="contained"
    startIcon={icon}
    endIcon={<ExpandMoreRoundedIcon />}
    sx={{
      minHeight: 58,
      px: 1.5,
      justifyContent: 'space-between',
      borderRadius: 3,
      bgcolor: active ? alpha('#22c55e', 0.1) : '#fff',
      color: '#0f172a',
      boxShadow: 'none',
      border: active ? '1.5px solid #22c55e' : '1px solid rgba(15, 23, 42, 0.08)',
      textTransform: 'none',
      minWidth: wide ? 188 : 'auto',
      '&:hover': {
        bgcolor: active ? alpha('#22c55e', 0.15) : '#f8fafc',
        boxShadow: 'none'
      }
    }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#64748b', lineHeight: 1.1 }}>{title}</Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 800,
          color: active ? '#15803d' : '#0f172a',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: wide ? 130 : 110
        }}>
        {value}
      </Typography>
    </Box>
  </Button>
)

// ─── Province + Ward Picker Dialog ──────────────────────────────────────────
function ProvinceWardDialog({ open, onClose, filters, onApply }) {
  const [step, setStep] = useState('province') // 'province' | 'ward'
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [searchText, setSearchText] = useState('')

  const filteredProvinces = useMemo(() => {
    if (!searchText.trim()) return VIETNAM_PROVINCES
    const lower = searchText.toLowerCase()
    return VIETNAM_PROVINCES.filter((p) => p.name.toLowerCase().includes(lower))
  }, [searchText])

  const handleSelectProvince = (province) => {
    setSelectedProvince(province)
    setStep('ward')
    setSearchText('')
  }

  const handleSelectWard = (ward) => {
    onApply({ province: selectedProvince.name, district: ward })
    handleClose()
  }

  const handleSelectAllWards = () => {
    onApply({ province: selectedProvince.name, district: '' })
    handleClose()
  }

  const handleSelectAll = () => {
    onApply({ province: '', district: '' })
    handleClose()
  }

  const handleClose = () => {
    setStep('province')
    setSelectedProvince(null)
    setSearchText('')
    onClose()
  }

  const handleBack = () => {
    setStep('province')
    setSelectedProvince(null)
    setSearchText('')
  }

  const isAllSelected = !filters?.province && !filters?.district

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 900,
          pb: 1,
          borderBottom: '1px solid #f1f5f9'
        }}>
        {step === 'ward' && (
          <IconButton onClick={handleBack} size="small" sx={{ mr: 0.5 }}>
            <KeyboardArrowLeftRoundedIcon />
          </IconButton>
        )}
        {step === 'province' ? 'Chọn tỉnh / thành phố' : `${selectedProvince?.name} — Chọn phường / xã`}
      </DialogTitle>

      <DialogContent sx={{ pt: '12px !important' }}>
        {/* Search box */}
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

        {step === 'province' && (
          <Grid container spacing={1.25}>
            {/* Toàn quốc */}
            <Grid item xs={12}>
              <Button
                fullWidth
                onClick={handleSelectAll}
                sx={{
                  minHeight: 50,
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  border: isAllSelected ? '2px solid #22c55e' : '1px solid rgba(15, 118, 110, 0.16)',
                  bgcolor: isAllSelected ? alpha('#22c55e', 0.08) : '#fff',
                  color: '#0f172a',
                  textTransform: 'none',
                  px: 2
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnRoundedIcon sx={{ color: '#22c55e', fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 800 }}>Toàn quốc</Typography>
                </Box>
                {isAllSelected ? (
                  <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} />
                ) : (
                  <ChevronRightRoundedIcon />
                )}
              </Button>
            </Grid>

            {filteredProvinces.map((province) => {
              const isActive = filters?.province === province.name
              return (
                <Grid item xs={12} sm={6} key={province.id}>
                  <Button
                    fullWidth
                    onClick={() => handleSelectProvince(province)}
                    sx={{
                      minHeight: 54,
                      justifyContent: 'space-between',
                      borderRadius: 3,
                      border: isActive ? '2px solid #22c55e' : '1px solid rgba(15, 118, 110, 0.16)',
                      bgcolor: isActive ? alpha('#22c55e', 0.08) : '#fff',
                      color: '#0f172a',
                      textTransform: 'none',
                      px: 2,
                      '&:hover': {
                        bgcolor: alpha('#0284c7', 0.06),
                        borderColor: '#0284c7'
                      }
                    }}>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{province.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#64748b' }}>
                        {province.wards.length} phường / xã
                      </Typography>
                    </Box>
                    {isActive ? (
                      <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} />
                    ) : (
                      <ChevronRightRoundedIcon sx={{ color: '#94a3b8' }} />
                    )}
                  </Button>
                </Grid>
              )
            })}
          </Grid>
        )}

        {step === 'ward' && selectedProvince && (
          <Grid container spacing={1.25}>
            {/* Toàn tỉnh */}
            <Grid item xs={12}>
              <Button
                fullWidth
                onClick={handleSelectAllWards}
                sx={{
                  minHeight: 50,
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  border:
                    filters?.province === selectedProvince.name && !filters?.district
                      ? '2px solid #22c55e'
                      : '1px solid rgba(15, 118, 110, 0.16)',
                  bgcolor:
                    filters?.province === selectedProvince.name && !filters?.district
                      ? alpha('#22c55e', 0.08)
                      : '#fff',
                  color: '#0f172a',
                  textTransform: 'none',
                  px: 2
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnRoundedIcon sx={{ color: '#22c55e', fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 800 }}>Toàn {selectedProvince.name}</Typography>
                </Box>
                {filters?.province === selectedProvince.name && !filters?.district ? (
                  <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} />
                ) : (
                  <ChevronRightRoundedIcon />
                )}
              </Button>
            </Grid>

            {selectedProvince.wards
              .filter((ward) => !searchText.trim() || ward.toLowerCase().includes(searchText.toLowerCase()))
              .map((ward) => {
                const isActive = filters?.district === ward
                return (
                  <Grid item xs={12} sm={6} key={ward}>
                    <Button
                      fullWidth
                      onClick={() => handleSelectWard(ward)}
                      sx={{
                        minHeight: 50,
                        justifyContent: 'space-between',
                        borderRadius: 3,
                        border: isActive ? '2px solid #22c55e' : '1px solid rgba(15, 118, 110, 0.16)',
                        bgcolor: isActive ? alpha('#22c55e', 0.08) : '#fff',
                        color: '#0f172a',
                        textTransform: 'none',
                        px: 2,
                        '&:hover': {
                          bgcolor: alpha('#0284c7', 0.06),
                          borderColor: '#0284c7'
                        }
                      }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, textAlign: 'left' }}>{ward}</Typography>
                      {isActive ? (
                        <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} />
                      ) : (
                        <ChevronRightRoundedIcon sx={{ color: '#94a3b8' }} />
                      )}
                    </Button>
                  </Grid>
                )
              })}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
function HeaderHomeSection({ filters, onFiltersChange, onSearch, searchOptions }) {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [advancedDialogOpen, setAdvancedDialogOpen] = useState(false)
  const [priceAnchorEl, setPriceAnchorEl] = useState(null)
  const [areaAnchorEl, setAreaAnchorEl] = useState(null)
  const [draftAdvancedFilters, setDraftAdvancedFilters] = useState({
    rentalCategory: '',
    occupation: ''
  })

  const priceLabel = getRangeLabel(PRICE_OPTIONS, { minPrice: 'minPrice', maxPrice: 'maxPrice' }, filters, 'Tất cả mức giá')
  const areaLabel = getRangeLabel(AREA_OPTIONS, { minArea: 'minArea', maxArea: 'maxArea' }, filters, 'Tất cả diện tích')

  // Label hiển thị cho nút vị trí
  const locationLabel = useMemo(() => {
    if (filters?.district) return filters.district
    if (filters?.province) return filters.province
    return 'Toàn khu vực'
  }, [filters?.district, filters?.province])

  const updateFilters = (patch) => {
    onFiltersChange((previousFilters) => ({
      ...previousFilters,
      ...patch
    }))
  }

  const handleSearchSubmit = () => {
    onSearch(filters)
  }

  const handlePriceSelect = (option) => {
    updateFilters({
      minPrice: option.minPrice,
      maxPrice: option.maxPrice
    })
    setPriceAnchorEl(null)
  }

  const handleAreaSelect = (option) => {
    updateFilters({
      minArea: option.minArea,
      maxArea: option.maxArea
    })
    setAreaAnchorEl(null)
  }

  const handleLocationApply = ({ province, district }) => {
    updateFilters({
      province: province || '',
      district: district || '',
      // Cập nhật query để search API nhận đúng
      query: district || province || ''
    })
  }

  const openAdvancedDialog = () => {
    setDraftAdvancedFilters({
      rentalCategory: filters?.rentalCategory || '',
      occupation: filters?.occupation || ''
    })
    setAdvancedDialogOpen(true)
  }

  const hasLocationFilter = !!(filters?.province || filters?.district)
  const hasPriceFilter = filters?.minPrice !== null || filters?.maxPrice !== null
  const hasAreaFilter = filters?.minArea !== null || filters?.maxArea !== null
  const hasTypeFilter = !!filters?.rentalCategory

  return (
    <Box
      id="header-home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background:
          "linear-gradient(125deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 118, 110, 0.86) 50%, rgba(245, 158, 11, 0.78) 100%), url('/backgroud_plaform.jpeg') center/cover no-repeat"
      }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(255,255,255,0.12), transparent 24%)'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 7, md: 10 } }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                icon={<AutoAwesomeRoundedIcon sx={{ color: '#0f172a !important' }} />}
                label="Nền tảng tìm phòng trọ, căn hộ mini và ký túc xá"
                sx={{
                  mb: 2.5,
                  bgcolor: '#fef3c7',
                  color: '#0f172a',
                  fontWeight: 800
                }}
              />
            </Box>

            <Typography
              variant="h2"
              sx={{
                maxWidth: 760,
                mx: 'auto',
                textAlign: 'center',
                fontSize: { xs: '2.3rem', md: '4rem' },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.04em'
              }}>
              Khám phá phòng cho thuê đúng khu vực, đúng mức giá và dễ ra quyết định hơn.
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: 720,
                mx: 'auto',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.84)',
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.8
              }}>
              Giao diện mới chia nhỏ theo từng section rõ ràng để người dùng tìm nhanh hơn, đồng thời giúp đội ngũ dễ
              quản lý và mở rộng sau này.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                mt: 3.5,
                mx: 'auto',
                maxWidth: 900,
                p: { xs: 2, md: 2.25 },
                borderRadius: 5,
                bgcolor: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(14px)'
              }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    lg: '1fr 148px'
                  },
                  gap: 1.25
                }}>
                <Autocomplete
                  freeSolo
                  options={searchOptions}
                  fullWidth
                  inputValue={filters?.query || ''}
                  onInputChange={(_, value) => updateFilters({ query: value })}
                  onChange={(_, value) => {
                    const nextValue = typeof value === 'string' ? value : value?.label || ''
                    updateFilters({ query: nextValue })
                  }}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label || '')}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{option.label}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: 13 }}>{option.caption}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Nhập địa điểm, tên đường hoặc nội dung cần tìm..."
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          handleSearchSubmit()
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: '#0284c7' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          minHeight: 58,
                          bgcolor: '#fff',
                          borderRadius: 3
                        }
                      }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  onClick={handleSearchSubmit}
                  sx={{
                    minHeight: 58,
                    borderRadius: 3,
                    fontWeight: 800,
                    fontSize: 18,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fb8c00 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)'
                    }
                  }}>
                  Tìm kiếm
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr 1fr',
                    lg: '1fr 1fr 1fr 1fr'
                  },
                  gap: 1.25,
                  mt: 1.25
                }}>
                {/* ── Nút Tỉnh/Phường ── */}
                <SearchActionButton
                  title="Tỉnh / Phường"
                  value={locationLabel}
                  icon={<LocationOnRoundedIcon />}
                  onClick={() => setLocationDialogOpen(true)}
                  active={hasLocationFilter}
                />

                {/* ── Nút Mức giá ── */}
                <SearchActionButton
                  title="Mức giá"
                  value={priceLabel}
                  onClick={(event) => setPriceAnchorEl(event.currentTarget)}
                  active={hasPriceFilter}
                />

                {/* ── Nút Diện tích ── */}
                <SearchActionButton
                  title="Diện tích"
                  value={areaLabel}
                  onClick={(event) => setAreaAnchorEl(event.currentTarget)}
                  active={hasAreaFilter}
                />

                {/* ── Nút Loại hình ── */}
                <Button
                  onClick={openAdvancedDialog}
                  variant="contained"
                  startIcon={<TuneRoundedIcon />}
                  sx={{
                    minHeight: 58,
                    borderRadius: 3,
                    bgcolor: hasTypeFilter ? alpha('#22c55e', 0.1) : '#fff',
                    color: hasTypeFilter ? '#15803d' : '#0f172a',
                    boxShadow: 'none',
                    fontWeight: 800,
                    textTransform: 'none',
                    border: hasTypeFilter ? '1.5px solid #22c55e' : '1px solid rgba(15, 23, 42, 0.08)',
                    '&:hover': {
                      bgcolor: hasTypeFilter ? alpha('#22c55e', 0.15) : '#f8fafc',
                      boxShadow: 'none'
                    }
                  }}>
                  {getPropertyTypeLabel(filters?.rentalCategory)}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* ── Menu Mức giá ── */}
      <Menu anchorEl={priceAnchorEl} open={Boolean(priceAnchorEl)} onClose={() => setPriceAnchorEl(null)}>
        {PRICE_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handlePriceSelect(option)} selected={priceLabel === option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* ── Menu Diện tích ── */}
      <Menu anchorEl={areaAnchorEl} open={Boolean(areaAnchorEl)} onClose={() => setAreaAnchorEl(null)}>
        {AREA_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleAreaSelect(option)} selected={areaLabel === option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* ── Dialog Tỉnh / Phường (2 bước) ── */}
      <ProvinceWardDialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        filters={filters}
        onApply={handleLocationApply}
      />

      {/* ── Dialog Loại hình tìm kiếm ── */}
      <Dialog open={advancedDialogOpen} onClose={() => setAdvancedDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 900, fontSize: 30 }}>Loại hình tìm kiếm?</DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <Grid container spacing={0}>
            {PROPERTY_TYPE_OPTIONS.map((option) => {
              const isSelected = draftAdvancedFilters.rentalCategory === option.value

              return (
                <Grid item xs={12} sm={6} key={option.value}>
                  <Button
                    fullWidth
                    onClick={() =>
                      setDraftAdvancedFilters((previous) => ({
                        ...previous,
                        rentalCategory: isSelected ? '' : option.value
                      }))
                    }
                    sx={{
                      minHeight: 56,
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      bgcolor: isSelected ? alpha('#22c55e', 0.08) : '#fff',
                      color: isSelected ? '#2b7ed7' : '#0f172a',
                      fontWeight: isSelected ? 900 : 700,
                      textTransform: 'none'
                    }}>
                    {isSelected ? <CheckCircleRoundedIcon sx={{ mr: 1, color: '#22c55e' }} /> : null}
                    {option.label}
                  </Button>
                </Grid>
              )
            })}
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
            <Button
              fullWidth
              onClick={() => setAdvancedDialogOpen(false)}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                bgcolor: '#e5e7eb',
                color: '#111827',
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#d1d5db'
                }
              }}>
              Đóng bộ lọc
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                updateFilters(draftAdvancedFilters)
                setAdvancedDialogOpen(false)
                // Tự động search sau khi áp dụng
                setTimeout(() => onSearch({ ...filters, ...draftAdvancedFilters }), 50)
              }}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                bgcolor: '#2b7ed7',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1d6fbf'
                }
              }}>
              Áp dụng tiêu chí
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default HeaderHomeSection
