import { Alert, Box, Container } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLatestSearchRooms, getSearchRooms } from '~/apis/searchAPI'
import DistrictSearchSection from './sections/DistrictSearchSection'
import DownloadOwnerBlockSection from './sections/DownloadOwnerBlockSection'
import HeaderHomeSection from './sections/HeaderHomeSection'
import LatestRoomsSection from './sections/LatestRoomsSection'
import MarketplaceInsightsSection from './sections/MarketplaceInsightsSection'
import MenuHomeSection from './sections/MenuHomeSection'
import OwnerBookingSection from './sections/OwnerBookingSection'
import PopularRoomsSection from './sections/PopularRoomsSection'
import PromotionSection from './sections/PromotionSection'
import ProvinceSearchSection from './sections/ProvinceSearchSection'
import ReadyToMoveRoomsSection from './sections/ReadyToMoveRoomsSection'
import SuggestSpecialSection from './sections/SuggestSpecialSection'
import WardSection from './sections/WardSection'
import { buildRrmsDashboard } from './sections/rrmsData'

const LATEST_PER_PAGE = 6

const getApiResult = (payload) => (Array.isArray(payload?.result) ? payload.result : [])

function RRMS({ setIsAdmin }) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [allRooms, setAllRooms] = useState([])
  const [latestRooms, setLatestRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentLatestPage, setCurrentLatestPage] = useState(1)

  useEffect(() => {
    setIsAdmin(false)
    window.scrollTo(0, 0)
  }, [setIsAdmin])

  useEffect(() => {
    let cancelled = false

    const loadRrmsPage = async () => {
      setLoading(true)
      setError('')

      try {
        const [allRoomsResponse, latestRoomsResponse] = await Promise.allSettled([getSearchRooms(), getLatestSearchRooms()])

        if (cancelled) return

        const nextAllRooms = allRoomsResponse.status === 'fulfilled' ? getApiResult(allRoomsResponse.value) : []
        const nextLatestRooms = latestRoomsResponse.status === 'fulfilled' ? getApiResult(latestRoomsResponse.value) : []

        setAllRooms(nextAllRooms)
        setLatestRooms(nextLatestRooms)

        if (nextAllRooms.length === 0 && nextLatestRooms.length === 0) {
          setError('Hiện chưa lấy được dữ liệu danh sách phòng từ backend. Vui lòng kiểm tra lại BE hoặc endpoint public.')
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error('Error fetching RRMS data:', fetchError)
          setAllRooms([])
          setLatestRooms([])
          setError('Không thể tải dữ liệu RRMS từ backend ở thời điểm này.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadRrmsPage()

    return () => {
      cancelled = true
    }
  }, [])

  const dashboard = useMemo(() => buildRrmsDashboard({ allRooms, latestRooms }), [allRooms, latestRooms])

  const latestTotalPages = Math.max(1, Math.ceil(dashboard.latestRooms.length / LATEST_PER_PAGE))

  const latestVisibleRooms = useMemo(() => {
    const start = (currentLatestPage - 1) * LATEST_PER_PAGE
    return dashboard.latestRooms.slice(start, start + LATEST_PER_PAGE)
  }, [currentLatestPage, dashboard.latestRooms])

  const searchOptions = useMemo(() => {
    const optionsMap = new Map()

    dashboard.provinceGroups.slice(0, 6).forEach((item) => {
      optionsMap.set(`province-${item.label}`, {
        label: item.label,
        caption: `${item.count} tin theo tỉnh thành`
      })
    })

    dashboard.districtGroups.slice(0, 6).forEach((item) => {
      optionsMap.set(`district-${item.label}`, {
        label: item.label,
        caption: `${item.count} tin theo quận huyện`
      })
    })

    dashboard.wardGroups.slice(0, 6).forEach((item) => {
      optionsMap.set(`ward-${item.label}`, {
        label: item.label,
        caption: `${item.count} tin theo phường xã`
      })
    })

    return [...optionsMap.values()]
  }, [dashboard.districtGroups, dashboard.provinceGroups, dashboard.wardGroups])

  const popularKeywords = useMemo(() => {
    const keywords = [
      ...dashboard.districtGroups.slice(0, 10).map((item) => item.label),
      ...dashboard.provinceGroups.slice(0, 6).map((item) => item.label),
      ...dashboard.wardGroups.slice(0, 4).map((item) => item.label)
    ]

    return [...new Set(keywords)].slice(0, 20)
  }, [dashboard.districtGroups, dashboard.provinceGroups, dashboard.wardGroups])

  useEffect(() => {
    setCurrentLatestPage(1)
  }, [dashboard.latestRooms.length])

  const handleSearch = (value = searchText) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      navigate('/search')
      return
    }

    navigate(`/search?query=${encodeURIComponent(trimmedValue)}`)
  }

  const handleSelectLocation = (location) => {
    navigate(`/search?query=${encodeURIComponent(location)}`)
  }

  const handleOpenRoom = (roomId) => {
    if (!roomId) return
    navigate(`/detail/${roomId}`)
  }

  const handleJumpToSection = (sectionId) => {
    const target = document.getElementById(sectionId)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f7fbff 0%, #edf6ff 20%, #ffffff 56%, #f8fafc 100%)'
      }}>
      <HeaderHomeSection
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={handleSearch}
        searchOptions={searchOptions}
        stats={dashboard.stats}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        {error ? (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        ) : null}

        <MenuHomeSection onJumpToSection={handleJumpToSection} />
        <DownloadOwnerBlockSection stats={dashboard.stats} />
        <PromotionSection room={dashboard.promotionHeroRoom} stats={dashboard.stats} onExplorePromotions={() => handleSearch(searchText)} />
        <ProvinceSearchSection items={dashboard.provinceGroups} onSelectProvince={handleSelectLocation} />
        <SuggestSpecialSection items={dashboard.specialSuggestions} onOpenRoom={handleOpenRoom} />
        <PopularRoomsSection rooms={dashboard.popularRooms} loading={loading} onViewAll={() => navigate('/search')} />
        <ReadyToMoveRoomsSection rooms={dashboard.readyRooms} loading={loading} />
        <DistrictSearchSection items={dashboard.districtGroups} onSelectDistrict={handleSelectLocation} />
        <WardSection items={dashboard.wardGroups} onSelectWard={handleSelectLocation} />
        <LatestRoomsSection
          rooms={latestVisibleRooms}
          loading={loading}
          currentPage={currentLatestPage}
          totalPages={latestTotalPages}
          onPageChange={setCurrentLatestPage}
        />
        <OwnerBookingSection stats={dashboard.stats} />
        <MarketplaceInsightsSection
          stats={dashboard.stats}
          keywords={popularKeywords}
          onSelectKeyword={handleSelectLocation}
          onOpenSupport={() => navigate('/support')}
          onOpenBroker={() => navigate('/register')}
        />
      </Container>
    </Box>
  )
}

export default RRMS
