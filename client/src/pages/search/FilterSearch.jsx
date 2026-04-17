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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '@uidotdev/usehooks'
import AudioRecorderModal from '../AI/Audio'
import { searchByName } from '~/apis/searchAPI'
import ModalSearch from './ModalSearch'
import SearchSurfaceCard from './sections/SearchSurfaceCard'

function FilterSearch({ setSearchData, searchKeyWord, setKeyword, keyword, setTotalRooms }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [openAudio, setOpenAudio] = useState(false)
  const [range, setRange] = useState([0, 50])
  const [selectedValue, setSelectedValue] = useState('0-50')
  const [area, setArea] = useState([0, 50])
  const [selectedValueArea, setSelectedValueArea] = useState('0-50')
  const [isRecording, setIsRecording] = useState(false)
  const [cityValue, setCityValue] = useState('Hồ Chí Minh')
  const [districtValue, setDistrictValue] = useState('Quận 1')
  const [isFirstSelection, setIsFirstSelection] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  const runSearch = async (value) => {
    if (!value) return

    try {
      const searchResult = await searchByName(value)
      const result = searchResult.data.result || []
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
    if (!searchKeyWord && debouncedKeyword) {
      runSearch(debouncedKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, searchKeyWord])

  const handleSearchChange = (event) => {
    setKeyword(event.target.value)
  }

  const handleSearchSubmit = () => {
    runSearch(keyword)
  }

  const handleAreaChange = (event) => {
    const nextValue = event.target.value
    setSelectedValueArea(nextValue)

    switch (nextValue) {
      case '1-5':
        setArea([1, 5])
        break
      case '5-10':
        setArea([5, 10])
        break
      case '10-15':
        setArea([10, 15])
        break
      default:
        setArea([0, 50])
    }
  }

  const handleSliderChangeArea = (event, newValue) => {
    setArea(newValue)
    const [min, max] = newValue

    if (min === 1 && max === 5) setSelectedValueArea('1-5')
    else if (min === 5 && max === 10) setSelectedValueArea('5-10')
    else if (min === 10 && max === 15) setSelectedValueArea('10-15')
    else setSelectedValueArea('0-50')
  }

  const handlePriceChange = (event) => {
    const nextValue = event.target.value
    setSelectedValue(nextValue)

    switch (nextValue) {
      case '1-5':
        setRange([1, 5])
        break
      case '5-10':
        setRange([5, 10])
        break
      case '10-15':
        setRange([10, 15])
        break
      default:
        setRange([0, 50])
    }
  }

  const handleSliderChange = (event, newValue) => {
    setRange(newValue)
    const [min, max] = newValue

    if (min === 1 && max === 5) setSelectedValue('1-5')
    else if (min === 5 && max === 10) setSelectedValue('5-10')
    else if (min === 10 && max === 15) setSelectedValue('10-15')
    else setSelectedValue('0-50')
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
                <MenuItem value="1-5">1 - 5 m²</MenuItem>
                <MenuItem value="5-10">5 - 10 m²</MenuItem>
                <MenuItem value="10-15">10 - 15 m²</MenuItem>
                <MenuItem value="0-50">{t('searchPage.filter.underArea')}</MenuItem>
              </Select>
              <Slider value={area} onChange={handleSliderChangeArea} max={50} size="small" sx={{ mt: 1 }} />
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
                <MenuItem value="1-5">1 - 5 triệu</MenuItem>
                <MenuItem value="5-10">5 - 10 triệu</MenuItem>
                <MenuItem value="10-15">10 - 15 triệu</MenuItem>
                <MenuItem value="0-50">{t('searchPage.filter.underPrice')}</MenuItem>
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
