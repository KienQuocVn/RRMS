import { Box, Container } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import BannerHorizontal from '~/components/BannerHorizontal'
import { getSearchRooms } from '~/apis/searchAPI'
import DistrictList from './DistrictList'
import FilterSearch from './FilterSearch'
import ItemSearch from './ItemSearch'
import Name from './Name'
import RoomList from './RoomList'
import Text from './Text'

const parseNumberParam = (value) => {
  if (value === null || value === '') return null

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function Search({ setIsAdmin }) {
  const [searchData, setSearchData] = useState([])
  const [totalRooms, setTotalRooms] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { searchKeyWord } = location.state || {}
  const [searchParams] = useSearchParams()

  const resolvedFilters = useMemo(() => {
    const keywordFromQuery = searchParams.get('query')

    return {
      query: searchKeyWord || keywordFromQuery || '',
      district: searchParams.get('district') || '',
      minPrice: parseNumberParam(searchParams.get('minPrice')),
      maxPrice: parseNumberParam(searchParams.get('maxPrice')),
      minArea: parseNumberParam(searchParams.get('minArea')),
      maxArea: parseNumberParam(searchParams.get('maxArea')),
      rentalCategory: searchParams.get('rentalCategory') || '',
      occupation: searchParams.get('occupation') || ''
    }
  }, [searchKeyWord, searchParams])

  useEffect(() => {
    setIsAdmin(false)
  }, [setIsAdmin])

  useEffect(() => {
    setKeyword(resolvedFilters.query || resolvedFilters.district || '')
  }, [resolvedFilters])

  useEffect(() => {
    const loadDataSearch = async () => {
      setIsLoading(true)

      try {
        const requestParams = Object.fromEntries(
          Object.entries({
            query: resolvedFilters.query || undefined,
            district: resolvedFilters.district || undefined,
            minPrice: resolvedFilters.minPrice ?? undefined,
            maxPrice: resolvedFilters.maxPrice ?? undefined,
            minArea: resolvedFilters.minArea ?? undefined,
            maxArea: resolvedFilters.maxArea ?? undefined,
            rentalCategory: resolvedFilters.rentalCategory || undefined
          }).filter(([, value]) => value !== undefined)
        )

        const response = await getSearchRooms(requestParams)
        const result = Array.isArray(response?.result) ? response.result : []
        setSearchData(result)
        setTotalRooms(result.length)
      } catch (error) {
        console.error('Error fetching search data:', error)
        setSearchData([])
        setTotalRooms(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadDataSearch()
  }, [resolvedFilters])

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: { xs: 2.5, md: 4 },
        background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 28%, #ffffff 100%)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
          <FilterSearch
            setTotalRooms={setTotalRooms}
            setSearchData={setSearchData}
            keyword={keyword}
            setKeyword={setKeyword}
            initialFilters={resolvedFilters}
          />

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
              gap: 3,
              alignItems: 'start'
            }}
          >
            <RoomList searchData={searchData} totalRooms={totalRooms} keyword={keyword} isLoading={isLoading} />

            <Box sx={{ display: 'grid', gap: 2.25 }}>
              <Name />
              <DistrictList />
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'grid', gap: 3 }}>
            <Text keyword={keyword} totalRooms={totalRooms} />
            <BannerHorizontal />
            <ItemSearch />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Search
