import { useCallback, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { Alert, Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { approveBulletinBoard, getAllBulletinBoards, hideBulletinBoard, rejectBulletinBoard } from '~/apis/bulletinBoardAPI'
import { DASHBOARD_COLORS } from './constants/dashboardTheme'
import PostApprovalHeader from '../components/postApproval/PostApprovalHeader'
import PostApprovalStatsBar from '../components/postApproval/PostApprovalStatsBar'
import PostApprovalFilters from '../components/postApproval/PostApprovalFilters'
import PostApprovalTable from '../components/postApproval/PostApprovalTable'
import PostApprovalPreview from '../components/postApproval/PostApprovalPreview'
import RejectPostModal from '../components/postApproval/RejectPostModal'
import {
  buildDerivedStats,
  matchesPriceRange,
  matchesTimeRange,
  normalizeBoard,
  POST_APPROVAL_CITY_OPTIONS,
  POST_APPROVAL_PRICE_OPTIONS,
  POST_APPROVAL_ROOM_TYPE_OPTIONS,
  POST_APPROVAL_STATUS_OPTIONS,
  POST_APPROVAL_TIME_OPTIONS
} from '../components/postApproval/postApprovalUtils'

const DEFAULT_FILTERS = {
  status: 'Chờ duyệt',
  roomType: 'Tất cả',
  city: 'Tất cả',
  priceRange: 'Tất cả',
  timeRange: 'Tất cả',
  keyword: ''
}

const ListPosts = ({ setIsAdmin } = {}) => {
  const [bulletinBoards, setBulletinBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [activePostId, setActivePostId] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [checkedIds, setCheckedIds] = useState([])
  const [showInlineRejectReason, setShowInlineRejectReason] = useState(false)
  const [rejectModalState, setRejectModalState] = useState({
    open: false,
    ids: [],
    postTitle: '',
    reason: '',
    selectedReasons: [],
    notifyOwner: true
  })
  const [actionStats, setActionStats] = useState({})

  const fetchBulletinBoards = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getAllBulletinBoards()
      setBulletinBoards(response?.result || [])
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài đăng:', err)
      setError('Không thể tải danh sách bài đăng chờ duyệt. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setIsAdmin?.(true)
    fetchBulletinBoards()
  }, [fetchBulletinBoards, setIsAdmin])

  const normalizedPosts = useMemo(
    () => bulletinBoards.map((board, index) => normalizeBoard(board, index)),
    [bulletinBoards]
  )

  const filteredPosts = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    return normalizedPosts.filter((post) => {
      const matchesKeyword =
          !keyword ||
          [post.title, post.ownerName, post.addressParts.fullAddress]
              .join(' ')
              .toLowerCase()
              .includes(keyword)

      const matchesStatus = filters.status === 'Tất cả' || post.statusLabel === filters.status
      const matchesRoomType = filters.roomType === 'Tất cả' || post.roomTypeLabel === filters.roomType
      const matchesCity = filters.city === 'Tất cả' || post.addressParts.city.includes(filters.city)
      const matchesPrice = matchesPriceRange(post.displayPrice, filters.priceRange)
      const matchesTime = matchesTimeRange(post.postedDate, filters.timeRange)

      return matchesKeyword && matchesStatus && matchesRoomType && matchesCity && matchesPrice && matchesTime
    })
  }, [filters, normalizedPosts])

  const approvalStats = useMemo(() => buildDerivedStats(normalizedPosts, actionStats), [actionStats, normalizedPosts])

  const activePost = useMemo(
    () =>
      isPreviewOpen && activePostId
        ? filteredPosts.find((post) => post.uiKey === activePostId) || null
        : null,
    [activePostId, filteredPosts, isPreviewOpen]
  )

  useEffect(() => {
    if (!filteredPosts.length || !activePostId) {
      setActivePostId(null)
      return
    }

    if (!filteredPosts.some((post) => post.uiKey === activePostId)) {
      setActivePostId(null)
      setIsPreviewOpen(false)
    }
  }, [activePostId, filteredPosts])

  useEffect(() => {
    const maxPage = Math.max(Math.ceil(filteredPosts.length / rowsPerPage) - 1, 0)
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [filteredPosts.length, page, rowsPerPage])

  const updateActionStat = (key) => {
    setActionStats((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }

  const removeBoardsFromState = (ids = []) => {
    setBulletinBoards((prev) => prev.filter((board) => !ids.includes(board.bulletinBoardId)))
    setCheckedIds((prev) => prev.filter((id) => !ids.includes(id)))
  }

  const handleApproveBoards = async (ids, successMessage) => {
    if (!ids.length) return

    const { isConfirmed } = await Swal.fire({
      title: 'Xác nhận duyệt bài',
      text: `Bạn có chắc muốn duyệt ${ids.length} bài đăng đã chọn không?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Duyệt ngay',
      cancelButtonText: 'Hủy'
    })

    if (!isConfirmed) return

    try {
      await Promise.all(ids.map((id) => approveBulletinBoard(id)))

      removeBoardsFromState(ids)
      updateActionStat('approvedToday')
      setShowInlineRejectReason(false)
      await Swal.fire('Thành công', successMessage, 'success')
    } catch (err) {
      console.error('Lỗi khi duyệt bài:', err)
      Swal.fire('Lỗi', 'Không thể duyệt bài đăng. Vui lòng thử lại.', 'error')
    }
  }

  const openRejectModal = (posts) => {
    const ids = Array.isArray(posts) ? posts.map((post) => post.uiKey) : [posts.uiKey]
    const title = Array.isArray(posts) ? `${ids.length} bài đăng đã chọn` : posts.title

    setShowInlineRejectReason(true)
    setRejectModalState({
      open: true,
      ids,
      postTitle: title,
      reason: '',
      selectedReasons: [],
      notifyOwner: true
    })
  }

  const closeRejectModal = () => {
    setRejectModalState((prev) => ({
      ...prev,
      open: false
    }))
  }

  const buildRejectReason = () => {
    const selectedText = rejectModalState.selectedReasons.map((item) => `- ${item}`).join('\n')
    return [rejectModalState.reason.trim(), selectedText].filter(Boolean).join('\n')
  }

  const handleRejectSubmit = async () => {
    const finalReason = buildRejectReason().trim()

    if (!finalReason) {
      Swal.fire('Thiếu thông tin', 'Vui lòng nhập lý do từ chối trước khi xác nhận.', 'warning')
      return
    }

    try {
      await Promise.all(rejectModalState.ids.map((id) => rejectBulletinBoard(id, finalReason)))

      removeBoardsFromState(rejectModalState.ids)
      updateActionStat('rejectedToday')
      closeRejectModal()

      Swal.fire(
        'Đã từ chối',
        rejectModalState.notifyOwner
          ? 'Bài đăng đã bị từ chối và sẵn sàng gửi thông báo cho chủ trọ.'
          : 'Bài đăng đã bị từ chối.',
        'success'
      )
    } catch (err) {
      console.error('Lỗi khi từ chối bài:', err)
      Swal.fire('Lỗi', 'Không thể từ chối bài đăng. Vui lòng thử lại.', 'error')
    }
  }

  const handleMenuAction = async (action, post) => {
    if (action === 'Ẩn bài') {
      const { isConfirmed } = await Swal.fire({
        title: 'Xác nhận ẩn bài đăng',
        text: `Bạn có chắc muốn ẩn bài "${post.title}" khỏi danh sách công khai?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ẩn bài',
        cancelButtonText: 'Hủy'
      })

      if (!isConfirmed) return

      try {
        await hideBulletinBoard(post.uiKey)
        removeBoardsFromState([post.uiKey])
        Swal.fire('Thành công', 'Bài đăng đã được ẩn.', 'success')
      } catch (err) {
        console.error('Lỗi khi ẩn bài:', err)
        Swal.fire('Lỗi', 'Không thể ẩn bài đăng. Vui lòng thử lại.', 'error')
      }
      return
    }

    const messages = {
      'Liên hệ chủ trọ': `Liên hệ chủ trọ: ${post.ownerPhone}`,
      'Xem lịch sử': `Bài "${post.title}" đang ở trạng thái ${post.statusLabel}.`
    }

    Swal.fire('Thông tin', messages[action], 'info')
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(0)
    setIsPreviewOpen(false)
  }

  const handleToggleCheck = (id) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleToggleCheckAll = (posts) => {
    const postIds = posts.map((post) => post.uiKey)
    const allChecked = postIds.every((id) => checkedIds.includes(id))

    setCheckedIds((prev) => {
      if (allChecked) {
        return prev.filter((id) => !postIds.includes(id))
      }
      return Array.from(new Set([...prev, ...postIds]))
    })
  }

  if (loading) {
    return (
      <Box
        sx={{
          px: { xs: 2, lg: 3 },
          py: 2,
          bgcolor: DASHBOARD_COLORS.pageBg,
          minHeight: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <CircularProgress sx={{ color: DASHBOARD_COLORS.primary }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        bgcolor: DASHBOARD_COLORS.pageBg,
        minHeight: '100%',
        px: { xs: 2, lg: 3 },
        py: 2
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <PostApprovalHeader
          pendingCount={approvalStats.pending}
          onApproveAll={() =>
            handleApproveBoards(
              (checkedIds.length ? checkedIds : filteredPosts.map((post) => post.uiKey)).slice(0, filteredPosts.length),
              checkedIds.length ? `Đã duyệt ${checkedIds.length} bài đăng được chọn.` : 'Đã duyệt toàn bộ bài đăng đang hiển thị.'
            )
          }
        />

        <PostApprovalStatsBar stats={approvalStats} />

        <PostApprovalFilters
          filters={filters}
          statusOptions={POST_APPROVAL_STATUS_OPTIONS}
          roomTypeOptions={POST_APPROVAL_ROOM_TYPE_OPTIONS}
          cityOptions={POST_APPROVAL_CITY_OPTIONS}
          priceOptions={POST_APPROVAL_PRICE_OPTIONS}
          timeOptions={POST_APPROVAL_TIME_OPTIONS}
          onFilterChange={handleFilterChange}
        />

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, lg: isPreviewOpen ? 7 : 12 }}>
            <PostApprovalTable
              posts={filteredPosts}
              activePostId={activePost?.uiKey}
              checkedIds={checkedIds}
              page={page}
              rowsPerPage={rowsPerPage}
              onRowClick={(post) => {
                setActivePostId(post.uiKey)
                setIsPreviewOpen(true)
              }}
              onToggleCheck={handleToggleCheck}
              onToggleCheckAll={handleToggleCheckAll}
              onChangePage={setPage}
              onChangeRowsPerPage={(value) => {
                setRowsPerPage(value)
                setPage(0)
              }}
              onApprove={(post) => handleApproveBoards([post.uiKey], `Đã duyệt bài "${post.title}".`)}
              onReject={(post) => openRejectModal(post)}
              onPreview={(post) => {
                setActivePostId(post.uiKey)
                setIsPreviewOpen(true)
              }}
              onMenuAction={handleMenuAction}
              onApproveSelected={() => handleApproveBoards(checkedIds, `Đã duyệt ${checkedIds.length} bài đăng được chọn.`)}
              onRejectSelected={() => openRejectModal(normalizedPosts.filter((post) => checkedIds.includes(post.uiKey)))}
              onClearSelection={() => setCheckedIds([])}
            />
          </Grid>

          {isPreviewOpen && (
            <Grid size={{ xs: 12, lg: 5 }}>
              <PostApprovalPreview
                post={activePost}
                rejectReason={rejectModalState.reason}
                showInlineRejectReason={showInlineRejectReason}
                onClose={() => setIsPreviewOpen(false)}
                onApprove={(post) => handleApproveBoards([post.uiKey], `Đã duyệt bài "${post.title}".`)}
                onReject={(post) => openRejectModal(post)}
                onRejectReasonChange={(value) =>
                  setRejectModalState((prev) => ({
                    ...prev,
                    reason: value
                  }))
                }
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <RejectPostModal
        open={rejectModalState.open}
        postTitle={rejectModalState.postTitle}
        reason={rejectModalState.reason}
        selectedReasons={rejectModalState.selectedReasons}
        notifyOwner={rejectModalState.notifyOwner}
        onClose={closeRejectModal}
        onReasonChange={(value) => setRejectModalState((prev) => ({ ...prev, reason: value }))}
        onToggleQuickReason={(reason) =>
          setRejectModalState((prev) => ({
            ...prev,
            selectedReasons: prev.selectedReasons.includes(reason) ? prev.selectedReasons.filter((item) => item !== reason) : [...prev.selectedReasons, reason]
          }))
        }
        onToggleNotifyOwner={(checked) => setRejectModalState((prev) => ({ ...prev, notifyOwner: checked }))}
        onSubmit={handleRejectSubmit}
      />
    </Box>
  )
}

export default ListPosts