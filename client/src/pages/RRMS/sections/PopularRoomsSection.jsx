import { Box, Grid, Skeleton } from '@mui/material'
import SectionHeading from './SectionHeading'
import { NowRoomCard } from './RoomCard'

const RoomSkeleton = () => (
  <Box
    sx={{
      height: '100%',
      borderRadius: 6,
      overflow: 'hidden',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
    }}>
    <Skeleton variant="rectangular" height={240} />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="text" height={34} width="80%" />
      <Skeleton variant="text" height={24} width="65%" />
      <Skeleton variant="text" height={24} width="55%" />
    </Box>
  </Box>
)

function PopularRoomsSection({ rooms, loading, onViewAll }) {
  return (
    <Box id="popular-rooms" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="List of Popular Rooms"
        title="Danh sách phòng nổi bật"
        description="Những tin có chất lượng hiển thị tốt hơn, thông tin đầy đủ hơn hoặc đang có nhiều yếu tố hấp dẫn để nên xem trước."
        actionLabel="Mở trang tìm kiếm"
        onAction={onViewAll}
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} xl={3} key={index}>
                <RoomSkeleton />
              </Grid>
            ))
          : rooms.slice(0, 4).map((room) => (
              <Grid item xs={12} md={6} xl={3} key={room.bulletinBoardId}>
                <NowRoomCard item={room} />
              </Grid>
            ))}
      </Grid>
    </Box>
  )
}

export default PopularRoomsSection
