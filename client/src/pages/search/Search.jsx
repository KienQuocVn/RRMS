import { Box, Container } from '@mui/material'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { searchBulletinBoardByAddress } from '~/apis/bulletinBoardAPI'
import BannerHorizontal from '~/components/BannerHorizontal'
import { env } from '~/configs/environment'
import DistrictList from './DistrictList'
import FilterSearch from './FilterSearch'
import ItemSearch from './ItemSearch'
import Name from './Name'
import RoomList from './RoomList'
import Text from './Text'

const queryKeywordMap = {
  hcm: 'Hồ Chí Minh',
  hn: 'Hà Nội',
  bd: 'Bình Dương',
  ct: 'Cần Thơ',
  dn: 'Đà Nẵng',
  'đn': 'Đồng Nai',
  'Quận 1': 'Quận 1',
  'Quận 12': 'Quận 12',
  'Quận Tân Bình': 'Quận Tân Bình',
  'Quận Gò Vấp': 'Quận Gò Vấp',
  'Quận Tân Phú': 'Quận Tân Phú',
  'Quận 3': 'Quận 3',
  'Quận 4': 'Quận 4',
  'Quận 10': 'Quận 10',
  'Quận 5': 'Quận 5',
  'Quận 11': 'Quận 11',
  'Quận 6': 'Quận 6',
  'Thành Phố Thủ Đức': 'Thành Phố Thủ Đức',
  'Quận Phú Nhuận': 'Quận Phú Nhuận',
  'Tân Định': 'Tân Định',
  'Đa Kao': 'Đa Kao',
  'Bến Nghé': 'Bến Nghé',
  'Bến Thành': 'Bến Thành',
  'Nguyễn Thái Bình': 'Nguyễn Thái Bình',
  'Phạm Ngũ Lão': 'Phạm Ngũ Lão',
  'Cầu Ông Lãnh': 'Cầu Ông Lãnh',
  'Cô Giang': 'Cô Giang',
  'Nguyễn Cư Trinh': 'Nguyễn Cư Trinh',
  'Cầu Kho': 'Cầu Kho',
  'Thu Dau 1': 'Thu Dau 1',
  'Dong An Ba': 'Dong An Ba',
  'Ngoc To': 'Ngoc To',
  'Quận Bình Thạnh': 'Quận Bình Thạnh'
}

function Search({ setIsAdmin }) {
  const [searchData, setSearchData] = useState([])
  const [totalRooms, setTotalRooms] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { searchKeyWord } = location.state || {}
  const [searchParams] = useSearchParams()

  const queryKeyword = searchParams.get('query')
  const resolvedKeyword = useMemo(() => {
    if (searchKeyWord) return searchKeyWord
    return queryKeywordMap[queryKeyword] || ''
  }, [queryKeyword, searchKeyWord])

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setKeyword(resolvedKeyword)
  }, [resolvedKeyword])

  useEffect(() => {
    const loadDataSearch = async () => {
      setIsLoading(true)

      try {
        if (resolvedKeyword) {
          const res = await searchBulletinBoardByAddress(resolvedKeyword)
          const result = Array.isArray(res.result) ? res.result : []
          setSearchData(result)
          setTotalRooms(result.length)
          return
        }

        const response = await axios.get(`${env.API_URL}/searchs`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.status === 200) {
          const fetchedData = Array.isArray(response.data.result) ? response.data.result : []
          setSearchData(fetchedData)
          setTotalRooms(fetchedData.length)
        } else {
          setSearchData([])
          setTotalRooms(0)
        }
      } catch (error) {
        console.error('Error fetching search data:', error)
        setSearchData([])
        setTotalRooms(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadDataSearch()
  }, [resolvedKeyword])

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
            searchKeyWord={searchKeyWord}
            setSearchData={setSearchData}
            keyword={keyword}
            setKeyword={setKeyword}
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
