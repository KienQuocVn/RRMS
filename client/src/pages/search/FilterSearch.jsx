import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '@uidotdev/usehooks'
import AudioRecorderModal from '../AI/Audio'
import { getSearchRooms } from '~/apis/searchAPI'
import ModalSearch from './ModalSearch'
import SearchSurfaceCard from './sections/SearchSurfaceCard'

const getPricePreset = (minPrice, maxPrice) => {
  if (maxPrice === 3000000) return { value: 'below-3', range: [0, 3] }
  if (minPrice === 3000000 && maxPrice === 5000000) return { value: '3-5', range: [3, 5] }
  if (minPrice === 5000000 && maxPrice === 10000000) return { value: '5-10', range: [5, 10] }
  if (minPrice === 10000000 && maxPrice === 15000000) return { value: '10-15', range: [10, 15] }
  if (minPrice === 15000000 && maxPrice === null) return { value: 'above-15', range: [15, 50] }
  return { value: 'all', range: [0, 50] }
}

const getAreaPreset = (minArea, maxArea) => {
  if (maxArea === 20) return { value: 'below-20', range: [0, 20] }
  if (minArea === 20 && maxArea === 30) return { value: '20-30', range: [20, 30] }
  if (minArea === 30 && maxArea === 50) return { value: '30-50', range: [30, 50] }
  if (minArea === 50 && maxArea === 70) return { value: '50-70', range: [50, 70] }
  if (minArea === 70 && maxArea === null) return { value: 'above-70', range: [70, 100] }
  return { value: 'all', range: [0, 100] }
}

function FilterSearch({ setSearchData, setKeyword, keyword, setTotalRooms, initialFilters }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openAudio, setOpenAudio] = useState(false)
  const [range, setRange] = useState([0, 50])
  const [selectedValue, setSelectedValue] = useState('all')
  const [area, setArea] = useState([0, 100])
  const [selectedValueArea, setSelectedValueArea] = useState('all')
  const [isRecording, setIsRecording] = useState(false)
  const [cityValue, setCityValue] = useState('Hồ Chí Minh')
  const [districtValue, setDistrictValue] = useState('')
  const [isFirstSelection, setIsFirstSelection] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    const nextPricePreset = getPricePreset(initialFilters?.minPrice, initialFilters?.maxPrice)
    const nextAreaPreset = getAreaPreset(initialFilters?.minArea, initialFilters?.maxArea)

    setRange(nextPricePreset.range)
    setSelectedValue(nextPricePreset.value)
    setArea(nextAreaPreset.range)
    setSelectedValueArea(nextAreaPreset.value)
    setDistrictValue(initialFilters?.district || '')
  }, [initialFilters])

  const requestParams = useMemo(
    () =>
      Object.fromEntries(
        Object.entries({
          query: keyword?.trim() || undefined,
          district: districtValue || undefined,
          minPrice: range[0] > 0 ? range[0] * 1000000 : undefined,
          maxPrice: range[1] < 50 ? range[1] * 1000000 : undefined,
          minArea: area[0] > 0 ? area[0] : undefined,
          maxArea: area[1] < 100 ? area[1] : undefined,
          rentalCategory: initialFilters?.rentalCategory || undefined
        }).filter(([, value]) => value !== undefined)
      ),
    [area, districtValue, initialFilters?.rentalCategory, keyword, range]
  )

  const runSearch = async (params = requestParams) => {
    try {
      const response = await getSearchRooms(params)
      const result = Array.isArray(response?.result) ? response.result : []
      setSearchData(result)
      setTotalRooms(result.length)
    } catch (error) {
      console.error('Error fetching search data:', error)
      setSearchData([])
      setTotalRooms(0)
    }
  }

  const filterSearchFunc = (tinhThanh, quanHuyen) => {
    if (tinhThanh && !quanHuyen) {
      setCityValue(tinhThanh)
      setDistrictValue('')
      setKeyword(tinhThanh)
      setIsFirstSelection(false)
      return
    }

    if (!tinhThanh && quanHuyen) {
      setDistrictValue(quanHuyen)
      setKeyword(quanHuyen)
      setIsFirstSelection(false)
      return
    }

    if (tinhThanh && quanHuyen) {
      if (isFirstSelection) {
        setCityValue(tinhThanh)
        setDistrictValue(quanHuyen)
        setKeyword(quanHuyen)
        setIsFirstSelection(false)
      } else if (tinhThanh !== cityValue) {
        setCityValue(tinhThanh)
        setDistrictValue('')
        setKeyword(tinhThanh)
      } else {
        setCityValue(tinhThanh)
        setDistrictValue(quanHuyen)
        setKeyword(quanHuyen)
      }
    }
  }

  useEffect(() => {
    if (debouncedKeyword?.trim() || districtValue) {
      runSearch({
        ...requestParams,
        query: debouncedKeyword.trim() || undefined
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, districtValue])

  const handleSearchChange = (event) => {
    setKeyword(event.target.value)
  }

  const handleSearchSubmit = () => {
    runSearch()
  }

  const handleAreaChange = (event) => {
    const nextValue = event.target.value
    setSelectedValueArea(nextValue)

    switch (nextValue) {
      case 'below-20':
        setArea([0, 20])
        break
      case '20-30':
        setArea([20, 30])
        break
      case '30-50':
        setArea([30, 50])
        break
      case '50-70':
        setArea([50, 70])
        break
      case 'above-70':
        setArea([70, 100])
        break
      default:
        setArea([0, 100])
    }
  }

  const handleSliderChangeArea = (event, newValue) => {
    setArea(newValue)
    const [min, max] = newValue

    if (min === 0 && max === 20) setSelectedValueArea('below-20')
    else if (min === 20 && max === 30) setSelectedValueArea('20-30')
    else if (min === 30 && max === 50) setSelectedValueArea('30-50')
    else if (min === 50 && max === 70) setSelectedValueArea('50-70')
    else if (min === 70 && max === 100) setSelectedValueArea('above-70')
    else setSelectedValueArea('all')
  }

  const handlePriceChange = (event) => {
    const nextValue = event.target.value
    setSelectedValue(nextValue)

    switch (nextValue) {
      case 'below-3':
        setRange([0, 3])
        break
      case '3-5':
        setRange([3, 5])
        break
      case '5-10':
        setRange([5, 10])
        break
      case '10-15':
        setRange([10, 15])
        break
      case 'above-15':
        setRange([15, 50])
        break
      default:
        setRange([0, 50])
    }
  }

  const handleSliderChange = (event, newValue) => {
    setRange(newValue)
    const [min, max] = newValue

    if (min === 0 && max === 3) setSelectedValue('below-3')
    else if (min === 3 && max === 5) setSelectedValue('3-5')
    else if (min === 5 && max === 10) setSelectedValue('5-10')
    else if (min === 10 && max === 15) setSelectedValue('10-15')
    else if (min === 15 && max === 50) setSelectedValue('above-15')
    else setSelectedValue('all')
  }

  return (
    <SearchSurfaceCard
      sx={{
        p: { xs: 2, md: 2.5 },
        background: 'linear-gradient(135deg, #0f172a 0%, #1453d1 58%, #35b0ff 100%)',
        color: '#fff',
        boxShadow: '0 28px 70px rgba(20, 83, 209, 0.18)'
      }}
    >
      <Stack spacing={2.2}>
        <Stack spacing={0.8}>
          <Typography sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 900, lineHeight: 1.15 }}>
            {t('searchPage.filter.title')}
          </Typography>
          <Typography sx={{ fontSize: 15, color: 'rgba(255,255,255,0.84)', maxWidth: 760 }}>{t('searchPage.filter.description')}</Typography>
        </Stack>

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '160px 220px minmax(0, 1fr) 200px 200px 120px' },
              gap: 1.5
            }}
          >
            <Button
              variant="contained"
              startIcon={<TuneRoundedIcon />}
              endIcon={<KeyboardArrowDownRoundedIcon />}
              onClick={() => setOpen(true)}
              sx={{
                height: 56,
                borderRadius: 2.5,
                fontWeight: 800,
                color: '#0f172a',
                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              {t('searchPage.filter.button')}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{
                height: 56,
                justifyContent: 'space-between',
                borderRadius: 2.5,
                px: 1.5,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.24)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>{t('searchPage.filter.areaLabel')}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                  {cityValue} {districtValue ? `- ${districtValue}` : ''}
                </Typography>
              </Box>
              <KeyboardArrowDownRoundedIcon />
            </Button>

            <TextField
              value={keyword}
              onChange={handleSearchChange}
              placeholder={t('searchPage.filter.keywordPlaceholder')}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSearchSubmit()
                }
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#667085' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOpenAudio(true)} sx={{ color: '#667085' }}>
                      <MicRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  borderRadius: 2.5,
                  backgroundColor: '#fff'
                }
              }}
            />

            <Paper
              variant="outlined"
              sx={{
                px: 1.5,
                py: 1.1,
                borderRadius: 2.5,
                borderColor: 'rgba(255,255,255,0.16)',
                backgroundColor: '#fff'
              }}
            >
              <Typography sx={{ fontSize: 12, color: '#667085' }}>{t('searchPage.filter.areaTitle')}</Typography>
              <Select
                variant="standard"
                disableUnderline
                fullWidth
                value={selectedValueArea}
                onChange={handleAreaChange}
                sx={{ mt: 0.3, fontWeight: 700 }}
              >
                <MenuItem value="below-20">Dưới 20 m²</MenuItem>
                <MenuItem value="20-30">20 - 30 m²</MenuItem>
                <MenuItem value="30-50">30 - 50 m²</MenuItem>
                <MenuItem value="50-70">50 - 70 m²</MenuItem>
                <MenuItem value="above-70">Trên 70 m²</MenuItem>
                <MenuItem value="all">Tất cả diện tích</MenuItem>
              </Select>
              <Slider value={area} onChange={handleSliderChangeArea} max={100} size="small" sx={{ mt: 1 }} />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                px: 1.5,
                py: 1.1,
                borderRadius: 2.5,
                borderColor: 'rgba(255,255,255,0.16)',
                backgroundColor: '#fff'
              }}
            >
              <Typography sx={{ fontSize: 12, color: '#667085' }}>{t('searchPage.filter.priceTitle')}</Typography>
              <Select
                variant="standard"
                disableUnderline
                fullWidth
                value={selectedValue}
                onChange={handlePriceChange}
                sx={{ mt: 0.3, fontWeight: 700 }}
              >
                <MenuItem value="below-3">Dưới 3 triệu</MenuItem>
                <MenuItem value="3-5">3 - 5 triệu</MenuItem>
                <MenuItem value="5-10">5 - 10 triệu</MenuItem>
                <MenuItem value="10-15">10 - 15 triệu</MenuItem>
                <MenuItem value="above-15">Trên 15 triệu</MenuItem>
                <MenuItem value="all">Tất cả mức giá</MenuItem>
              </Select>
              <Slider value={range} onChange={handleSliderChange} max={50} size="small" sx={{ mt: 1 }} />
            </Paper>

            <Button
              variant="contained"
              onClick={handleSearchSubmit}
              sx={{
                height: 56,
                borderRadius: 2.5,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#111827',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                }
              }}
            >
              {t('searchPage.filter.searchButton')}
            </Button>
          </Box>
        </Box>

        <ModalSearch filterSearch={filterSearchFunc} open={open} handleClose={() => setOpen(false)} />
        <AudioRecorderModal
          open={openAudio}
          setRecordedText={setKeyword}
          handleClose={() => setOpenAudio(false)}
          setIsRecording={setIsRecording}
          isRecording={isRecording}
          handleSearch={handleSearchSubmit}
        />
      </Stack>
    </SearchSurfaceCard>
  )
}

export default FilterSearch
