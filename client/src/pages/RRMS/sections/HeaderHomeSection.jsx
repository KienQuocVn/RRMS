import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
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
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'

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
  { value: 'ky-tuc-xa-sleepbox', label: 'Ký túc xá, sleepbox' },
  { value: 'nha-cho-thue', label: 'Nhà cho thuê' },
  { value: 'can-ho-chung-cu', label: 'Căn hộ chung cư' },
  { value: 'van-phong', label: 'Văn phòng' },
  { value: 'kho-nha-xuong', label: 'Kho, nhà xưởng' },
  { value: 'o-ghep-pass-phong', label: 'Ở ghép & pass phòng' }
]

const OCCUPATION_OPTIONS = [
  { value: 'sinh-vien', label: 'Sinh viên' },
  { value: 'nhan-vien-xi-nghiep', label: 'Nhân viên xí nghiệp' },
  { value: 'nhan-vien-van-phong', label: 'Nhân viên văn phòng' },
  { value: 'nganh-nghe-khac', label: 'Ngành nghề khác' }
]

const getRangeLabel = (options, keyMap, filters, fallbackLabel) => {
  const matchedOption = options.find((option) =>
    Object.entries(keyMap).every(([filterKey, optionKey]) => filters?.[filterKey] === option[optionKey])
  )

  return matchedOption?.label || fallbackLabel
}

const getPropertyTypeLabel = (value) => PROPERTY_TYPE_OPTIONS.find((option) => option.value === value)?.label || '...Thêm'

const SearchActionButton = ({ title, value, icon, onClick, wide = false }) => (
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
      bgcolor: '#fff',
      color: '#0f172a',
      boxShadow: 'none',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      textTransform: 'none',
      minWidth: wide ? 188 : 'auto',
      '&:hover': {
        bgcolor: '#f8fafc',
        boxShadow: 'none'
      }
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#64748b', lineHeight: 1.1 }}>{title}</Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.35,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: wide ? 130 : 110
        }}
      >
        {value}
      </Typography>
    </Box>
  </Button>
)

function HeaderHomeSection({ filters, onFiltersChange, onSearch, searchOptions, districtOptions }) {
  const [districtDialogOpen, setDistrictDialogOpen] = useState(false)
  const [advancedDialogOpen, setAdvancedDialogOpen] = useState(false)
  const [priceAnchorEl, setPriceAnchorEl] = useState(null)
  const [areaAnchorEl, setAreaAnchorEl] = useState(null)
  const [draftAdvancedFilters, setDraftAdvancedFilters] = useState({
    rentalCategory: '',
    occupation: ''
  })

  const priceLabel = getRangeLabel(
    PRICE_OPTIONS,
    { minPrice: 'minPrice', maxPrice: 'maxPrice' },
    filters,
    'Giá'
  )
  const areaLabel = getRangeLabel(
    AREA_OPTIONS,
    { minArea: 'minArea', maxArea: 'maxArea' },
    filters,
    'Diện tích'
  )

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

  const openAdvancedDialog = () => {
    setDraftAdvancedFilters({
      rentalCategory: filters?.rentalCategory || '',
      occupation: filters?.occupation || ''
    })
    setAdvancedDialogOpen(true)
  }

  return (
    <Box
      id="header-home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background:
          "linear-gradient(125deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 118, 110, 0.86) 50%, rgba(245, 158, 11, 0.78) 100%), url('/backgroud_plaform.jpeg') center/cover no-repeat"
      }}
    >
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
              }}
            >
              Khám phá phòng cho thuê đúng khu vực, đúng mức giá và dễ ra quyết định hơn.
            </Typography>

            <Typography sx={{ mt: 2, maxWidth: 720, mx: 'auto', textAlign: 'center', color: 'rgba(255,255,255,0.84)', fontSize: { xs: 15, md: 17 }, lineHeight: 1.8 }}>
              Giao diện mới chia nhỏ theo từng section rõ ràng để người dùng tìm nhanh hơn, đồng thời giúp đội ngũ dễ quản lý và mở rộng sau này.
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
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    lg: '1fr 148px'
                  },
                  gap: 1.25
                }}
              >
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
                  }}
                >
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
                }}
              >
                <SearchActionButton
                  title="Quận huyện"
                  value={filters?.district || 'Toàn khu vực'}
                  icon={<LocationOnRoundedIcon />}
                  onClick={() => setDistrictDialogOpen(true)}
                />

                <SearchActionButton title="Mức giá" value={priceLabel} onClick={(event) => setPriceAnchorEl(event.currentTarget)} />

                <SearchActionButton title="Diện tích" value={areaLabel} onClick={(event) => setAreaAnchorEl(event.currentTarget)} />

                <Button
                  onClick={openAdvancedDialog}
                  variant="contained"
                  startIcon={<TuneRoundedIcon />}
                  sx={{
                    minHeight: 58,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    color: '#0f172a',
                    boxShadow: 'none',
                    fontWeight: 800,
                    textTransform: 'none',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    '&:hover': {
                      bgcolor: '#f8fafc',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {getPropertyTypeLabel(filters?.rentalCategory)}
                </Button>
              </Box>
            </Paper>
          </Grid>

          
        </Grid>
      </Container>

      <Menu anchorEl={priceAnchorEl} open={Boolean(priceAnchorEl)} onClose={() => setPriceAnchorEl(null)}>
        {PRICE_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handlePriceSelect(option)} selected={priceLabel === option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={areaAnchorEl} open={Boolean(areaAnchorEl)} onClose={() => setAreaAnchorEl(null)}>
        {AREA_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleAreaSelect(option)} selected={areaLabel === option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={districtDialogOpen} onClose={() => setDistrictDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 900 }}>Chọn quận / huyện</DialogTitle>
        <DialogContent sx={{ pt: '6px !important' }}>
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <Button
                fullWidth
                onClick={() => {
                  updateFilters({ district: '' })
                  setDistrictDialogOpen(false)
                }}
                sx={{
                  minHeight: 50,
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  border: '1px solid rgba(15, 118, 110, 0.16)',
                  bgcolor: filters?.district ? '#fff' : alpha('#22c55e', 0.08),
                  color: '#0f172a',
                  textTransform: 'none',
                  px: 2
                }}
              >
                <Typography sx={{ fontWeight: 800 }}>Toàn khu vực</Typography>
                {!filters?.district ? <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} /> : <ChevronRightRoundedIcon />}
              </Button>
            </Grid>

            {districtOptions.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <Button
                  fullWidth
                  onClick={() => {
                    updateFilters({ district: item.label })
                    setDistrictDialogOpen(false)
                  }}
                  sx={{
                    minHeight: 54,
                    justifyContent: 'space-between',
                    borderRadius: 3,
                    border: '1px solid rgba(15, 118, 110, 0.16)',
                    bgcolor: filters?.district === item.label ? alpha('#22c55e', 0.08) : '#fff',
                    color: '#0f172a',
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748b' }}>{item.count} tin đang hiển thị</Typography>
                  </Box>
                  {filters?.district === item.label ? <CheckCircleRoundedIcon sx={{ color: '#22c55e' }} /> : <ChevronRightRoundedIcon />}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

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
                    onClick={() => setDraftAdvancedFilters((previous) => ({ ...previous, rentalCategory: option.value }))}
                    sx={{
                      minHeight: 56,
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      bgcolor: isSelected ? alpha('#22c55e', 0.08) : '#fff',
                      color: isSelected ? '#16a34a' : '#0f172a',
                      fontWeight: isSelected ? 900 : 700,
                      textTransform: 'none'
                    }}
                  >
                    {isSelected ? <CheckCircleRoundedIcon sx={{ mr: 1, color: '#22c55e' }} /> : null}
                    {option.label}
                  </Button>
                </Grid>
              )
            })}
          </Grid>

          <Typography sx={{ mt: 3, mb: 1.5, textAlign: 'center', fontWeight: 900, fontSize: 24 }}>Hiện tại bạn đang làm gì?</Typography>

          <Grid container spacing={0}>
            {OCCUPATION_OPTIONS.map((option) => {
              const isSelected = draftAdvancedFilters.occupation === option.value

              return (
                <Grid item xs={12} sm={6} key={option.value}>
                  <Button
                    fullWidth
                    onClick={() => setDraftAdvancedFilters((previous) => ({ ...previous, occupation: option.value }))}
                    sx={{
                      minHeight: 56,
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      bgcolor: isSelected ? alpha('#22c55e', 0.08) : '#fff',
                      color: isSelected ? '#16a34a' : '#0f172a',
                      fontWeight: isSelected ? 900 : 700,
                      textTransform: 'none'
                    }}
                  >
                    {isSelected ? <CheckCircleRoundedIcon sx={{ mr: 1, color: '#22c55e' }} /> : null}
                    {option.label}
                  </Button>
                </Grid>
              )
            })}
          </Grid>

          <Typography sx={{ mt: 2, fontSize: 13, color: '#64748b' }}>
            Tiêu chí ngành nghề hiện mới lưu lựa chọn giao diện, backend chưa có trường dữ liệu riêng để lọc chính xác theo mục này.
          </Typography>

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
              }}
            >
              Đóng bộ lọc
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                updateFilters(draftAdvancedFilters)
                setAdvancedDialogOpen(false)
              }}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                bgcolor: '#22c55e',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#16a34a'
                }
              }}
            >
              Áp dụng tiêu chí
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default HeaderHomeSection
