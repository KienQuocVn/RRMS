import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Autocomplete, Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { getSearchRooms } from '~/apis/searchAPI'
import ModalSearch from './ModalSearch'
import SearchSurfaceCard from './sections/SearchSurfaceCard'

const CONTROL_HEIGHT = 50

const PRICE_OPTIONS = [
  { value: 'default', label: '' },
  { value: 'all', label: 'Giá' },
  { value: 'below-3', label: 'Dưới 3 triệu' },
  { value: '3-5', label: '3 - 5 triệu' },
  { value: '5-10', label: '5 - 10 triệu' },
  { value: '10-15', label: '10 - 15 triệu' },
  { value: 'above-15', label: 'Trên 15 triệu' }
]

const AREA_OPTIONS = [
  { value: 'default', label: '' },
  { value: 'all', label: 'Diện tích' },
  { value: 'below-20', label: 'Dưới 20 m²' },
  { value: '20-30', label: '20 - 30 m²' },
  { value: '30-50', label: '30 - 50 m²' },
  { value: '50-70', label: '50 - 70 m²' },
  { value: 'above-70', label: 'Trên 70 m²' }
]

const getPricePreset = (minPrice, maxPrice) => {
  if (maxPrice === 3000000) return { value: 'below-3', range: [0, 3] }
  if (minPrice === 3000000 && maxPrice === 5000000) return { value: '3-5', range: [3, 5] }
  if (minPrice === 5000000 && maxPrice === 10000000) return { value: '5-10', range: [5, 10] }
  if (minPrice === 10000000 && maxPrice === 15000000) return { value: '10-15', range: [10, 15] }
  if (minPrice === 15000000 && maxPrice === null) return { value: 'above-15', range: [15, 50] }
  return { value: 'default', range: [0, 50] }
}

const getAreaPreset = (minArea, maxArea) => {
  if (maxArea === 20) return { value: 'below-20', range: [0, 20] }
  if (minArea === 20 && maxArea === 30) return { value: '20-30', range: [20, 30] }
  if (minArea === 30 && maxArea === 50) return { value: '30-50', range: [30, 50] }
  if (minArea === 50 && maxArea === 70) return { value: '50-70', range: [50, 70] }
  if (minArea === 70 && maxArea === null) return { value: 'above-70', range: [70, 100] }
  return { value: 'default', range: [0, 100] }
}

const getAutocompleteFieldSx = (highlightBorder = false) => ({
  '& .MuiAutocomplete-popupIndicator': {
    color: '#6b7280'
  },
  '& .MuiOutlinedInput-root': {
    height: CONTROL_HEIGHT,
    borderRadius: 2,
    backgroundColor: '#fff',
    paddingRight: '8px !important',
    '& fieldset': {
      borderColor: highlightBorder ? '#1590d8' : '#d7e0ea'
    },
    '&:hover fieldset': {
      borderColor: highlightBorder ? '#1590d8' : '#b8c7d8'
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      borderColor: '#1590d8'
    }
  }
})

const getAutocompleteInputSx = (textColor = '#5f6b7a') => ({
  '& .MuiOutlinedInput-input': {
    px: 0.5,
    fontSize: 16,
    fontWeight: 600,
    color: textColor
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#8a94a6',
    opacity: 1
  }
})

function FilterSearch({ setSearchData, setKeyword, keyword, setTotalRooms, initialFilters }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState([0, 50])
  const [priceInput, setPriceInput] = useState('')
  const [area, setArea] = useState([0, 100])
  const [areaInput, setAreaInput] = useState('')
  const [cityValue, setCityValue] = useState('Hồ Chí Minh')
  const [districtValue, setDistrictValue] = useState('')
  const [isFirstSelection, setIsFirstSelection] = useState(true)

  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    const nextPricePreset = getPricePreset(initialFilters?.minPrice, initialFilters?.maxPrice)
    const nextAreaPreset = getAreaPreset(initialFilters?.minArea, initialFilters?.maxArea)

    setRange(nextPricePreset.range)
    setPriceInput(PRICE_OPTIONS.find((option) => option.value === nextPricePreset.value)?.label || '')
    setArea(nextAreaPreset.range)
    setAreaInput(AREA_OPTIONS.find((option) => option.value === nextAreaPreset.value)?.label || '')
    setDistrictValue(initialFilters?.district || '')
  }, [initialFilters])

  const keywordOptions = useMemo(() => {
    const suggestions = [
      districtValue,
      cityValue,
      districtValue && cityValue ? `${districtValue}, ${cityValue}` : '',
      keyword?.trim()
    ]

    return [...new Set(suggestions.filter(Boolean))]
  }, [cityValue, districtValue, keyword])

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

  const handleSearchSubmit = () => {
    runSearch()
  }

  const applyPricePreset = (nextValue) => {
    setPriceInput(PRICE_OPTIONS.find((option) => option.value === nextValue)?.label || '')

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

  const applyAreaPreset = (nextValue) => {
    setAreaInput(AREA_OPTIONS.find((option) => option.value === nextValue)?.label || '')

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

  const applyManualPriceInput = (rawValue) => {
    const normalizedValue = String(rawValue || '')
      .trim()
      .toLowerCase()

    if (!normalizedValue) {
      setPriceInput('')
      applyPricePreset('all')
      return
    }

    const matchedPreset = PRICE_OPTIONS.find((option) => option.label.toLowerCase() === normalizedValue)
    if (matchedPreset) {
      applyPricePreset(matchedPreset.value)
      return
    }

    const numbers = normalizedValue
      .replace(/triệu|trieu|tr|m|vnd|đ/g, ' ')
      .match(/\d+([.,]\d+)?/g)
      ?.map((item) => Number(item.replace(',', '.')))
      .filter((item) => !Number.isNaN(item))

    if (!numbers?.length) {
      setPriceInput(rawValue)
      return
    }

    if (normalizedValue.includes('-') && numbers.length >= 2) {
      const min = Math.min(numbers[0], numbers[1])
      const max = Math.max(numbers[0], numbers[1])
      setRange([min, max])
      setPriceInput(`${min} - ${max} triệu`)
      return
    }

    const firstValue = numbers[0]

    if (normalizedValue.includes('trên') || normalizedValue.includes('tren') || normalizedValue.includes('>')) {
      setRange([firstValue, 50])
      setPriceInput(`Trên ${firstValue} triệu`)
      return
    }

    if (normalizedValue.includes('dưới') || normalizedValue.includes('duoi') || normalizedValue.includes('<')) {
      setRange([0, firstValue])
      setPriceInput(`Dưới ${firstValue} triệu`)
      return
    }

    setRange([0, firstValue])
    setPriceInput(`${firstValue} triệu`)
  }

  const applyManualAreaInput = (rawValue) => {
    const normalizedValue = String(rawValue || '')
      .trim()
      .toLowerCase()

    if (!normalizedValue) {
      setAreaInput('')
      applyAreaPreset('all')
      return
    }

    const matchedPreset = AREA_OPTIONS.find((option) => option.label.toLowerCase() === normalizedValue)
    if (matchedPreset) {
      applyAreaPreset(matchedPreset.value)
      return
    }

    const numbers = normalizedValue
      .replace(/m²|m2|met vuong|m/g, ' ')
      .match(/\d+([.,]\d+)?/g)
      ?.map((item) => Number(item.replace(',', '.')))
      .filter((item) => !Number.isNaN(item))

    if (!numbers?.length) {
      setAreaInput(rawValue)
      return
    }

    if (normalizedValue.includes('-') && numbers.length >= 2) {
      const min = Math.min(numbers[0], numbers[1])
      const max = Math.max(numbers[0], numbers[1])
      setArea([min, max])
      setAreaInput(`${min} - ${max} m²`)
      return
    }

    const firstValue = numbers[0]

    if (normalizedValue.includes('trên') || normalizedValue.includes('tren') || normalizedValue.includes('>')) {
      setArea([firstValue, 100])
      setAreaInput(`Trên ${firstValue} m²`)
      return
    }

    if (normalizedValue.includes('dưới') || normalizedValue.includes('duoi') || normalizedValue.includes('<')) {
      setArea([0, firstValue])
      setAreaInput(`Dưới ${firstValue} m²`)
      return
    }

    setArea([0, firstValue])
    setAreaInput(`${firstValue} m²`)
  }

  return (
    <SearchSurfaceCard
      sx={{
        p: 1,
        borderRadius: 3,
        backgroundColor: '#eef4fb',
        border: '1px solid #d9e4f1',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)'
      }}
    >
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1} alignItems="stretch" sx={{ '& > *': { minWidth: 0 } }}>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          endIcon={<KeyboardArrowRightRoundedIcon sx={{ color: '#6b7280' }} />}
          sx={{
            minWidth: { xs: '100%', lg: 172 },
            height: CONTROL_HEIGHT,
            px: 1.4,
            justifyContent: 'space-between',
            borderRadius: 2,
            textTransform: 'none',
            borderColor: '#d7e0ea',
            backgroundColor: '#fff',
            color: '#111827',
            '&:hover': {
              borderColor: '#b8c7d8',
              backgroundColor: '#fff'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <PlaceOutlinedIcon sx={{ color: '#111827', fontSize: 20, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0, textAlign: 'left' }}>
              <Typography noWrap sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.15, color: '#111827' }}>
                {cityValue || 'Chọn thành phố'}
              </Typography>
              <Typography noWrap sx={{ mt: 0.2, fontSize: 12, color: '#111827' }}>
                {districtValue || 'Toàn khu vực'}
              </Typography>
            </Box>
          </Box>
        </Button>

        <Autocomplete
          freeSolo
          fullWidth
          value={null}
          inputValue={keyword}
          options={keywordOptions}
          forcePopupIcon
          popupIcon={<KeyboardArrowDownRoundedIcon sx={{ color: '#6b7280' }} />}
          onInputChange={(_, newInputValue) => {
            setKeyword(newInputValue)
          }}
          onChange={(_, newValue) => {
            setKeyword(typeof newValue === 'string' ? newValue : '')
          }}
          sx={{
            flex: 1,
            ...getAutocompleteFieldSx(true)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Nhập nơi"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleSearchSubmit()
                }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: '#1590d8' }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
              sx={getAutocompleteInputSx('#111827')}
            />
          )}
        />

        <Autocomplete
          freeSolo
          value={null}
          inputValue={priceInput}
          options={PRICE_OPTIONS.map((option) => option.label)}
          forcePopupIcon
          popupIcon={<KeyboardArrowDownRoundedIcon sx={{ color: '#6b7280' }} />}
          onInputChange={(_, newInputValue) => {
            setPriceInput(newInputValue)
          }}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string') {
              const matchedPriceOption = PRICE_OPTIONS.find((option) => option.label === newValue)
              if (matchedPriceOption) {
                applyPricePreset(matchedPriceOption.value)
                return
              }
              applyManualPriceInput(newValue)
            }
          }}
          sx={{
            width: { xs: '100%', sm: 152 },
            ...getAutocompleteFieldSx()
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Giá"
              onBlur={() => applyManualPriceInput(priceInput)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  applyManualPriceInput(priceInput)
                  handleSearchSubmit()
                }
              }}
              sx={getAutocompleteInputSx()}
            />
          )}
        />

        <Autocomplete
          freeSolo
          value={null}
          inputValue={areaInput}
          options={AREA_OPTIONS.map((option) => option.label)}
          forcePopupIcon
          popupIcon={<KeyboardArrowDownRoundedIcon sx={{ color: '#6b7280' }} />}
          onInputChange={(_, newInputValue) => {
            setAreaInput(newInputValue)
          }}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string') {
              const matchedAreaOption = AREA_OPTIONS.find((option) => option.label === newValue)
              if (matchedAreaOption) {
                applyAreaPreset(matchedAreaOption.value)
                return
              }
              applyManualAreaInput(newValue)
            }
          }}
          sx={{
            width: { xs: '100%', sm: 152 },
            ...getAutocompleteFieldSx()
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Diện tích"
              onBlur={() => applyManualAreaInput(areaInput)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  applyManualAreaInput(areaInput)
                  handleSearchSubmit()
                }
              }}
              sx={getAutocompleteInputSx()}
            />
          )}
        />

        <Button
          variant="outlined"
          startIcon={<TuneRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={() => setOpen(true)}
          sx={{
            height: CONTROL_HEIGHT,
            minWidth: { xs: '100%', sm: 126 },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 700,
            color: '#111827',
            borderColor: '#d7e0ea',
            backgroundColor: '#fff',
            '&:hover': {
              borderColor: '#b8c7d8',
              backgroundColor: '#fff'
            }
          }}
        >
          ... Thêm
        </Button>

        <Button
          variant="contained"
          startIcon={<SearchRoundedIcon />}
          onClick={handleSearchSubmit}
          sx={{
            height: CONTROL_HEIGHT,
            minWidth: { xs: '100%', sm: 136 },
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 700,
            backgroundColor: '#ff9800',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#f08a00',
              boxShadow: 'none'
            }
          }}
        >
          Tìm kiếm
        </Button>
      </Stack>

      <ModalSearch filterSearch={filterSearchFunc} open={open} handleClose={() => setOpen(false)} />
    </SearchSurfaceCard>
  )
}

export default FilterSearch
