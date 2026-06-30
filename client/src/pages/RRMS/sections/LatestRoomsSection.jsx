import { Box, Grid, Pagination, Skeleton } from '@mui/material'
import SectionHeading from './SectionHeading'
import { LatestRoomCard } from './RoomCard'

const LatestSkeleton = () => (
  <Box
    sx={{
      height: '100%',
      borderRadius: 6,
      overflow: 'hidden',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
    }}>
    <Skeleton variant="rectangular" height={220} />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="text" height={34} width="80%" />
      <Skeleton variant="text" height={24} width="55%" />
      <Skeleton variant="text" height={24} width="70%" />
    </Box>
  </Box>
)

function LatestRoomsSection({ rooms, loading, currentPage, totalPages, onPageChange }) {
  return (
    <Box id="latest-rooms" sx={{ mt: 7 }}>
      <SectionHeading
        title="Phòng cho thuê mới nhất"
        description="Danh sách cuối trang giữ vai trò như feed chính của RRMS, lấy trực tiếp từ API mới nhất và phân trang để dễ theo dõi."
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} md={6} xl={4} key={index}>
                <LatestSkeleton />
              </Grid>
            ))
          : rooms.map((room) => (
              <Grid item xs={12} md={6} xl={4} key={room.bulletinBoardId}>
                <LatestRoomCard room={room} />
              </Grid>
            ))}
      </Grid>

      {!loading && totalPages > 1 ? (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          shape="rounded"
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            '& .MuiPaginationItem-root': {
              fontWeight: 700
            }
          }}
        />
      ) : null}
    </Box>
  )
}

export default LatestRoomsSection
