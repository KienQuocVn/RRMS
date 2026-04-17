import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import { Alert, Box, Pagination, Snackbar, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getHeartByUsername, insertHeart } from '~/apis/heartAPI'
import ListSearch from './ListSearch'
import SearchList from './SearchList'
import SearchEmptyState from './sections/SearchEmptyState'
import SearchResultCard from './sections/SearchResultCard'

const ITEMS_PER_PAGE = 6

function RoomList({ searchData, totalRooms, keyword, isLoading }) {
  const { t } = useTranslation()
  const [visiblePhoneNumbers, setVisiblePhoneNumbers] = useState({})
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hearts, setHearts] = useState([])
  const [priceSortOrder, setPriceSortOrder] = useState('')
  const [areaSortOrder, setAreaSortOrder] = useState('')
  const navigate = useNavigate()

  const username = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') || 'null')?.username || ''
    } catch {
      return ''
    }
  }, [])

  const loadHearts = async () => {
    if (!username) {
      setHearts([])
      return
    }

    try {
      const response = await getHeartByUsername(username)
      if (response.data.code === 200) {
        setHearts(response.data.result.bulletinBoards || [])
      } else {
        setHearts([])
      }
    } catch (error) {
      console.error('Load hearts failed:', error)
      setHearts([])
    }
  }

  useEffect(() => {
    loadHearts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchData, priceSortOrder, areaSortOrder])

  const hasMatchingItem = (array, item) => array.some((element) => element.bulletinBoardId === item.bulletinBoardId)

  const sortedItems = useMemo(() => {
    const items = Array.isArray(searchData) ? [...searchData] : []

    if (priceSortOrder) {
      items.sort((a, b) => (priceSortOrder === 'asc' ? a.rentPrice - b.rentPrice : b.rentPrice - a.rentPrice))
    }

    if (areaSortOrder) {
      items.sort((a, b) => (areaSortOrder === 'asc' ? a.area - b.area : b.area - a.area))
    }

    return items
  }, [areaSortOrder, priceSortOrder, searchData])

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
    return sortedItems.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage, sortedItems])

  const handleTogglePhone = (id) => {
    setVisiblePhoneNumbers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleAddHeart = async (bulletinBoardId) => {
    if (!username) {
      Swal.fire({
        icon: 'warning',
        title: t('searchPage.results.favoriteLoginTitle'),
        text: t('searchPage.results.favoriteLoginText')
      })
      return
    }

    try {
      const response = await insertHeart(username, bulletinBoardId)
      if (response.code === 201) {
        Swal.fire({
          icon: 'success',
          title: t('searchPage.results.favoriteSuccessTitle'),
          text: t('searchPage.results.favoriteSuccessText')
        })
        loadHearts()
      } else {
        Swal.fire({
          icon: 'error',
          title: t('searchPage.results.favoriteErrorTitle'),
          text: t('searchPage.results.favoriteErrorText')
        })
      }
    } catch (error) {
      console.error('Add heart failed:', error)
      Swal.fire({
        icon: 'error',
        title: t('searchPage.results.favoriteErrorTitle'),
        text: t('searchPage.results.favoriteErrorText')
      })
    }
  }

  const handleCopyLink = async (bulletinBoardId) => {
    const linkToCopy = `${window.location.origin}/detail/${bulletinBoardId}`

    try {
      await navigator.clipboard.writeText(linkToCopy)
      setOpen(true)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePageChange = (roomId) => {
    navigate(`/detail/${roomId}`)
  }

  return (
    <Stack spacing={2}>
      <ListSearch cityValue={keyword} keyword={keyword} districtValue={keyword} />
      <SearchList totalRooms={totalRooms} setFilter={setPriceSortOrder} setArea={setAreaSortOrder} />

      {isLoading ? (
        <SearchEmptyState title={t('searchPage.results.loadingTitle')} description={t('searchPage.results.loadingDescription')} />
      ) : currentItems.length > 0 ? (
        <Stack spacing={2}>
          {currentItems.map((item) => {
            const itemKey = item?.bulletinBoardId || item?.roomId
            const phoneVisible = visiblePhoneNumbers[itemKey]
            const phoneNumber = item?.motel?.account?.phone || item?.account?.phone || t('searchPage.results.phoneUnavailable')
            const isFavorite = hasMatchingItem(hearts, item)

            return (
              <SearchResultCard
                key={itemKey}
                item={item}
                isFavorite={isFavorite}
                phoneVisible={phoneVisible}
                phoneNumber={phoneNumber}
                onViewDetail={() => handlePageChange(item?.bulletinBoardId)}
                onTogglePhone={() => handleTogglePhone(itemKey)}
                onAddFavorite={() => handleAddHeart(item?.bulletinBoardId)}
                onCopyLink={() => handleCopyLink(item?.bulletinBoardId)}
                onAlreadyFavorite={() =>
                  Swal.fire({
                    icon: 'info',
                    title: t('searchPage.results.favoriteExistsTitle'),
                    text: t('searchPage.results.favoriteExistsText')
                  })
                }
              />
            )
          })}

          <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(sortedItems.length / ITEMS_PER_PAGE)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Stack>
      ) : (
        <SearchEmptyState title={t('searchPage.results.emptyTitle')} description={t('searchPage.results.emptyDescription')} />
      )}

      <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)}>
        <Alert elevation={6} severity="success" icon={<LinkRoundedIcon fontSize="inherit" />} onClose={() => setOpen(false)}>
          {t('searchPage.results.copySuccess')}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default RoomList
